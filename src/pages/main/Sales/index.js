import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Button, Divider as MuiDivider, Grid, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";
import { AuthContext } from "../../../contexts/CognitoContext";

import { getSales, getSalesData } from "../../../services/SalesService";
import SalesTable from "../../sections/Sales/SalesTable";
import async from "../../../components/Async";

const SalesChart = async(() => import("../../sections/Sales/SalesChart"));
const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const queryParamsString = window.location.search;
  const { companies, filterOptions, setFilterOptions } = useContext(AppContext);
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [chartTitle, setChartTitle] = useState("All companies");
  const [tableTitle, setTableTitle] = useState("Sales");
  const [salesChartData, setSalesChartData] = useState(null);
  const [salesTableData, setSalesTableData] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loadingSalesChartData, setLoadingSalesChartData] = useState(false);
  const [loadingSalesTableData, setLoadingSalesTableData] = useState(false);

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
    setLoadingSalesChartData(true);
    getSales(queryParamsString).then((res) => {
      const { data, parameters } = res.data.body;

      setLoadingSalesChartData(false);
      if (data) {
        const chartData = {
          comparisonSeries: data.comparison_series,
          revenueSeries: data.revenue_series,
          forecastSeries: data?.revenue_forecast || {},
          stats: data.stats,
          forecast48h: parameters?.forecast_48h || false,
        };

        setSalesChartData(chartData);
      }
    });
    //TODO: Use the router URL params above here. Hopefully that will make it easy and keep everything consistent

    //call to get the table data
    setLoadingSalesTableData(true);
    getSalesData(queryParamsString).then((res) => {
      const { data } = res.data.body;
      console.log(data);

      setLoadingSalesTableData(false);
      if (data) {
        const tableData = data.map((item) => ({
          name: item.name,
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

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={refreshSalesData}
            disabled={loadingSalesChartData || loadingSalesTableData}
          >
            <RefreshIcon />
          </Button>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SalesChart
            title={chartTitle}
            data={salesChartData}
            filterOptions={filterOptions}
            loading={loadingSalesChartData}
            setFilterOptions={setFilterOptions}
          />
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
