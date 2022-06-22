import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  Card,
  Divider as MuiDivider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";
import { AuthContext } from "../../../contexts/CognitoContext";
import {
  getShippedChartData,
  getShippedTableData,
} from "../../../services/InventoryService";
import async from "../../../components/Async";

import InventoryTable from "../../sections/Inventory/InventoryTable";
const InventoryChart = async(() =>
  import("../../sections/Inventory/InventoryChart")
);

const Divider = styled(MuiDivider)(spacing);

const chartTabs = [{ label: "Shipped", value: "shipped" }];

const Inventory = () => {
  const queryParamsString = window.location.search;
  const { companies, filterOptions, setFilterOptions } = useContext(AppContext);
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [chartTitle, setChartTitle] = useState("All companies");
  const [tableTitle, setTableTitle] = useState("Sales");
  const [inventoryChartData, setInventoryChartData] = useState(null);
  const [inventoryTableData, setInventoryTableData] = useState(null);
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
        setTableTitle("Units Shipped");
      } else if (selectedCompanyList.length === 1) {
        const selectedCompany = allCompanies.find(
          (company) => company.id === selectedCompanyList[0].id
        );
        setChartTitle(selectedCompany.name);
        setTableTitle(selectedCompany.name);
      } else {
        setChartTitle("Multi companies");
        setTableTitle("Units Shipped");
      }
    }
    // .catch((err) => signOut());
  }, [filterOptions, companies]);

  const refreshInventoryData = useCallback(() => {
    setLoadingInventoryChartData(true);
    getShippedChartData(queryParamsString).then((res) => {
      const { data } = res.data.body;
      console.log(data);

      setLoadingInventoryChartData(false);
      if (data) {
        const chartData = {
          comparisonSeries: data.units_shipped_comparison_series,
          series: data.units_shipped_series,
          stats: data.stats,
        };

        setInventoryChartData(chartData);
      }
    });
    setLoadingInventoryTableData(true);
    getShippedTableData(queryParamsString).then((res) => {
      const { data } = res.data.body;
      console.log(data);

      setLoadingInventoryTableData(false);
      if (data) {
        const tableData = data.map((item) => ({
          name: item.brand,
          unitsShipped: item.total_units_shipped,
          comparisonUnitsShipped: item.total_units_shipped_comparison,
          change: item.total_units_shipped_change,
          companyId: item?.company_id,
          productId: item?.product_id,
        }));

        setInventoryTableData(tableData);
      }
    });
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
