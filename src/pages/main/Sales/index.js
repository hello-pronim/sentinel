import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { getSales } from "../../../services/SalesService";
import SalesTable from "../../sections/Sales/SalesTable";
import async from "../../../components/Async";
import data from "./data";

const SalesChart = async(() => import("../../sections/Sales/SalesChart"));

const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const search = useLocation().search;
  const { salesChartData, brands } = data;
  const [companyIds, setCompanyIds] = useState([]);
  const [marketIds, setMarketIds] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);

    setCompanyIds(searchParams.getAll("company_ids[]"));
    setMarketIds(searchParams.getAll("market_ids[]"));
  }, [search]);

  useEffect(() => {
    getSales({
      company_ids: JSON.stringify(companyIds),
      marketIds: JSON.stringify(marketIds),
    }).then((res) => {
      console.log(res);
    });
  }, [companyIds, marketIds]);

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
          <SalesChart
            title="All companies"
            description="Total: $123,456,789.11"
            data={salesChartData}
          />
        </Grid>
        <Grid item xs={12}>
          <SalesTable data={brands} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
