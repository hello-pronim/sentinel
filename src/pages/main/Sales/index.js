import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  Button,
  Card,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Tab,
  Tooltip,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import RefreshIcon from "@mui/icons-material/Refresh";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";
import { AuthContext } from "../../../contexts/CognitoContext";
import {
  getSalesPerformance,
  getSalesData,
} from "../../../services/SalesService";
import async from "../../../components/Async";

import SalesTable from "../../sections/Sales/SalesTable";
import SalesPerformance from "../../sections/Sales/SalesPerformance";
import Sources from "../../sections/Sales/Sources";
const SalesChart = async(() => import("../../sections/Sales/SalesChart"));
const SalesByCompanyChart = async(() =>
  import("../../sections/Sales/SalesByCompanyChart")
);

const Divider = styled(MuiDivider)(spacing);

const salesPerformanceItems = [
  { key: "week", label: "Gross Sales 1 Week" },
  { key: "month", label: "Gross Sales 1 Month" },
  { key: "3_month", label: "Gross Sales 3 Months" },
  { key: "6_month", label: "Gross Sales 6 Months" },
  { key: "year", label: "Gross Sales 1 Year" },
  { key: "ytd", label: "Year to Date" },
];
const chartTabs = [
  { label: "Gross Sales", value: "sales" },
  { label: "Sales by Company", value: "sales_by_company" },
  { label: "Sources", value: "sources" },
];

const Sales = () => {
  const queryParamsString = window.location.search;
  const { companies, filterOptions, setFilterOptions } = useContext(AppContext);
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [chartTitle, setChartTitle] = useState("All companies");
  const [tableTitle, setTableTitle] = useState("Sales");
  const [salesPerformanceData, setSalesPerformanceData] = useState(null);
  const [salesTableData, setSalesTableData] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loadingSalesPerformanceData, setLoadingSalesPerformanceData] =
    useState(false);
  const [loadingSalesTableData, setLoadingSalesTableData] = useState(false);
  const [selectedChartTab, setSelectedChartTab] = useState(chartTabs[0].value);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const selectedCompanyList = filterOptions.company.selectedOptions.map(
      (item) => item.option
    );

    setSelectedCompanies(selectedCompanyList);

    if (companies) {
      const companyCategories = Object.keys(companies);
      const allCompanies = [];

      companyCategories.forEach((category) => {
        companies[category].forEach((company) => allCompanies.push(company));
      });

      if (selectedCompanyList.length === allCompanies.length) {
        setChartTitle("All companies");
        setTableTitle("Sales");
      } else if (selectedCompanyList.length === 1) {
        const selectedCompany = allCompanies.find(
          (company) => company.id === selectedCompanyList[0].id
        );
        setChartTitle(selectedCompany.name);
        setTableTitle(selectedCompany.name);
      } else {
        setChartTitle("Multi companies");
        setTableTitle("Sales");
      }
    }
    // .catch((err) => signOut());
  }, [filterOptions, companies]);

  const refreshSalesData = useCallback(() => {
    setLoadingSalesPerformanceData(true);
    getSalesPerformance(queryParamsString).then((res) => {
      const { data } = res.data.body;

      setLoadingSalesPerformanceData(false);
      if (data) {
        const performanceData = {
          estimatedSalesChangeData: {
            label:
              "Estimated Gross Sales for " +
              new Intl.DateTimeFormat("en", { month: "long" }).format(
                new Date()
              ),
            data: {
              revenue: data["estimated_month"]?.revenue ?? 0,
              revenueChange: data["estimated_month"]?.revenue_change ?? 0,
            },
          },
          mtdSalesChangeData: {
            label: "MTD Total Gross Sales",
            data: {
              revenue: data["mtd"]?.revenue ?? 0,
              revenueChange: data["mtd"]?.revenue_change ?? 0,
            },
            trendLineData: data["sales_mtd_change_series"],
          },
          ytdSalesChangeData: {
            label: "YTD Total Gross Sales",
            data: {
              revenue: data["ytd"]?.revenue ?? 0,
              revenueChange: data["ytd"]?.revenue_change ?? 0,
            },
            trendLineData: data["sales_ytd_change_series"],
          },
          salesChanges: salesPerformanceItems.map((item) => ({
            label: item.label,
            data: {
              revenue: data[item.key]?.revenue ?? 0,
              revenueChange: data[item.key]?.revenue_change ?? 0,
            },
          })),
        };

        setSalesPerformanceData(performanceData);
      }
    });

    //call to get the table data
    setLoadingSalesTableData(true);
    getSalesData(queryParamsString).then((res) => {
      const { data } = res.data.body;

      setLoadingSalesTableData(false);
      if (data) {
        const tableData = data.map((item) => ({
          name: item.name,
          units: item.units,
          revenue: item.revenue,
          comparisonRevenue: item.comparison_revenue,
          revenueChange: item.revenue_change,
          type: item.type,
          companyId: item?.company_id,
          productId: item?.product_id,
        }));

        setSalesTableData(tableData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refreshSalesData();
    }
  }, [isInitialized, isAuthenticated, refreshSalesData]);

  const handleChartTabChanged = (event, tab) => {
    setSelectedChartTab(tab);
  };

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Refresh Data">
            <Button variant="contained" onClick={refreshSalesData}>
              <RefreshIcon />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          {salesPerformanceData !== null && !loadingSalesPerformanceData ? (
            <SalesPerformance
              title="Portfolio Performance"
              data={salesPerformanceData}
            />
          ) : (
            <Grid container justifyContent="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TabContext value={selectedChartTab}>
              <TabList
                onChange={handleChartTabChanged}
                variant="scrollable"
                scrollButtons="auto"
              >
                {chartTabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </TabList>
              <Divider />
              <TabPanel value="sales">
                <Grid container>
                  <Grid item xs={12}>
                    <SalesChart
                      title={chartTitle}
                      filterOptions={filterOptions}
                      setFilterOptions={setFilterOptions}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="sales_by_company">
                <Grid container>
                  <Grid item xs={12}>
                    <SalesByCompanyChart title="Sales by Company" />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="sources">
                <Grid container>
                  <Grid item xs={12}>
                    <Sources title="Datasource Status(Data Last Received)" />
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <SalesTable
            title={tableTitle}
            data={salesTableData}
            salesType={selectedCompanies.length === 1 ? "product" : "brand"}
            loading={loadingSalesTableData}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
