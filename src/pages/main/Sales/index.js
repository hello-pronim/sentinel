import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";
import { convertPriceFormat } from "../../../utils/functions";

import { getSales, getSalesData } from "../../../services/SalesService";
import SalesTable from "../../sections/Sales/SalesTable";
import BrandSalesTable from "../../sections/Sales/BrandSalesTable";
import async from "../../../components/Async";
import data from "./data";

const SalesChart = async(() => import("../../sections/Sales/SalesChart"));
const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const queryParamsString = window.location.search;
  const { companies, filterOptions } = useContext(AppContext);
  const { products } = data;
  const [chartTitle, setChartTitle] = useState("All companies");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [salesChartData, setSalesChartData] = useState(null);
  const [salesTableData, setSalesTableData] = useState(null);
  const [loadingSalesChartData, setLoadingSalesChartData] = useState(false);
  const [loadingSalesTableData, setLoadingSalesTableData] = useState(false);

  useEffect(() => {
    const selectedCompanyIds = filterOptions.company.selectedOptions.map(
      (item) => item.option.id
    );
    const selectedMarketIds = filterOptions.market.selectedOptions.map(
      (item) => item.option.id
    );
    const selectedCompanyList = filterOptions.company.selectedOptions.map(
      (item) => item.option
    );

    setSelectedCompanies(selectedCompanyList);

    setLoadingSalesChartData(true);
    getSales(queryParamsString).then((res) => {
      console.log(res);
      setLoadingSalesChartData(false);
      if (res) {
        const chartData = {
          comparisonSeries: res.comparison_series,
          revenueSeries: res.revenue_series,
          stats: res.stats,
        };

        setSalesChartData(chartData);
      }
    });
    //TODO: Use the router URL params above here. Hopefully that will make it easy and keep everything consistent

    //call to get the table data
    setLoadingSalesTableData(true);
    getSalesData(queryParamsString).then((res) => {
      console.log(res);
      setLoadingSalesTableData(false);
      if (res) {
        const tableData = res.map((item) => ({
          id: item.id,
          name: item.name,
          revenue: item.revenue,
          comparisonRevenue: item.comparison_revenue,
          revenueChange: item.revenue_change,
        }));

        setSalesTableData(tableData);
      }
    });

    if (companies) {
      const companyCategories = Object.keys(companies);
      const allCompanies = [];

      companyCategories.forEach((category) => {
        companies[category].forEach((company) => allCompanies.push(company));
      });

      if (selectedCompanyIds.length === allCompanies.length)
        setChartTitle("All companies");
      else if (selectedCompanyIds.length === 1) {
        const selectedCompany = allCompanies.find(
          (company) => company.id === selectedCompanyIds[0]
        );
        setChartTitle(selectedCompany.name);
      } else setChartTitle("Multi companies");
    }
    // .catch((err) => signOut());
  }, [filterOptions, companies]);

  const calculateTotalRevenue = () => {
    const { stats } = salesChartData;
    let total = 0;

    Object.keys(stats).forEach((key) => (total += stats[key]));

    return "Total: " + convertPriceFormat(total, "$");
  };

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          {!loadingSalesChartData && salesChartData !== null ? (
            <SalesChart
              title={chartTitle}
              description={calculateTotalRevenue()}
              data={salesChartData}
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
          {!loadingSalesTableData && salesTableData !== null ? (
            selectedCompanies.length !== 1 ? (
              <SalesTable data={salesTableData} />
            ) : (
              <BrandSalesTable
                brand={selectedCompanies[0].name}
                data={products}
              />
            )
          ) : (
            <Grid container justifyContent="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
