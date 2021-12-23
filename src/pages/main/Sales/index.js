import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Button, Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { spacing } from "@mui/system";

import Breadcrumbs from "../../sections/global/Breadcrumbs";
import SalesTable from "../../sections/SalesTable";
import async from "../../../components/Async";
import data from "./data";

const SalesChart = async(() => import("../../sections/SalesChart"));

const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const { salesChartData, brands: brandsTableData } = data;
  const brandsTableColumns = [
    { id: "id", label: "#", alignment: "center" },
    { id: "brand", label: "Brand", alignment: "left" },
    { id: "revenue", label: "Revenue", alignment: "center" },
    {
      id: "comparisonRevenue",
      label: "Comparison Revenue",
      alignment: "center",
    },
    { id: "revenueChange", label: "Revenue Change", alignment: "center" },
    { id: "actions", label: "Actions", alignment: "right" },
  ];

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales
          </Typography>
          <Breadcrumbs pageTitle="Sales" aria-label="Breadcrumb" mt={2} />
        </Grid>
        <Grid item>
          <div>
            <Button variant="contained" color="primary">
              <AddIcon />
              New Order
            </Button>
          </div>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SalesChart
            title="All companies"
            description="Total: $39,923"
            data={salesChartData}
          />
        </Grid>
        <Grid item xs={12}>
          <SalesTable data={brandsTableData} columns={brandsTableColumns} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
