import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";

import { getSales } from "../../../services/SalesService";
import SalesTable from "../../sections/Sales/SalesTable";
import async from "../../../components/Async";
import data from "./data";

const SalesChart = async(() => import("../../sections/Sales/SalesChart"));

const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const { companies, markets, filterOptions, setFilterOptions } =
    useContext(AppContext);
  const { salesChartData, brands } = data;
  const [chartTitle, setChartTitle] = useState("All companies");

  useEffect(() => {
    const companyIds = filterOptions.company.selectedOptions.map(
      (item) => item.option.id
    );
    const marketIds = filterOptions.market.selectedOptions.map(
      (item) => item.option.id
    );

    getSales({
      company_ids: JSON.stringify(companyIds),
      marketIds: JSON.stringify(marketIds),
    }).then((res) => {
      console.log(res);
    });
  }, [filterOptions]);

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
            title={chartTitle}
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
