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
import { getSales, getSalesData } from "../../../services/SalesService";
import async from "../../../components/Async";

import InventoryTable from "../../sections/Inventory/InventoryTable";
import data from "./data";
const InventoryChart = async(() =>
  import("../../sections/Inventory/InventoryChart")
);

const Divider = styled(MuiDivider)(spacing);

const chartTabs = [
  { label: "Shipped", value: "shipped" },
  { label: "Future Content Tab", value: "coming_soon" },
];

const Inventory = () => {
  const queryParamsString = window.location.search;
  const { companies, filterOptions, setFilterOptions } = useContext(AppContext);
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [chartTitle, setChartTitle] = useState("All companies");
  const [tableTitle, setTableTitle] = useState("Sales");
  const [inventoryChartData, setInventoryChartData] = useState(null);
  // const [inventoryTableData, setInventoryTableData] = useState(null);
  const { inventoryTableData } = data;
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loadingInventoryChartData, setLoadingInventoryChartData] =
    useState(false);
  const [loadingInventoryTableData, setLoadingInventoryTableData] =
    useState(false);
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

  const refreshInventoryData = useCallback(() => {
    setLoadingInventoryChartData(true);
    getSales(queryParamsString).then((res) => {
      const { data, parameters } = res.data.body;

      setLoadingInventoryChartData(false);
      if (data) {
        const chartData = {
          comparisonSeries: data.comparison_series,
          revenueSeries: data.revenue_series,
          changeSeries: data.revenue_change,
          forecastSeries: data?.revenue_forecast || {},
          stats: data.stats,
          forecast48h: parameters?.forecast_48h || false,
        };

        setInventoryChartData(chartData);
      }
    });
    // setLoadingInventoryTableData(true);
    // getSalesData(queryParamsString).then((res) => {
    //   const { data } = res.data.body;

    //   setLoadingInventoryTableData(false);
    //   if (data) {
    //     const tableData = data.map((item) => ({
    //       name: item.name,
    //       revenue: item.revenue,
    //       comparisonRevenue: item.comparison_revenue,
    //       revenueChange: item.revenue_change,
    //       type: item.type,
    //       companyId: item?.company_id,
    //       productId: item?.product_id,
    //     }));

    //     setInventoryTableData(tableData);
    //   }
    // });
  }, [queryParamsString]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refreshInventoryData();
    }
  }, [isInitialized, isAuthenticated, refreshInventoryData]);

  const handleChartTabChanged = (event, tab) => {
    setSelectedChartTab(tab);
  };

  return (
    <React.Fragment>
      <Helmet title="Inventory" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Inventory
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Refresh Data">
            <Button
              variant="contained"
              onClick={refreshInventoryData}
              disabled={loadingInventoryChartData || loadingInventoryTableData}
            >
              <RefreshIcon />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
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
              <TabPanel value="shipped">
                <Grid container>
                  <Grid item xs={12}>
                    <InventoryChart
                      title={chartTitle}
                      data={inventoryChartData}
                      filterOptions={filterOptions}
                      loading={loadingInventoryChartData}
                      setFilterOptions={setFilterOptions}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="coming_soon">
                <Grid container>
                  <Grid item xs={12}></Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <InventoryTable
            title={tableTitle}
            data={inventoryTableData}
            shippedType={selectedCompanies.length === 1 ? "product" : "brand"}
            loading={loadingInventoryTableData}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Inventory;
