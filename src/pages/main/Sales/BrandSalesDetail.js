import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import BrandSalesTable from "../../sections/Sales/BrandSalesTable";
import async from "../../../components/Async";
import data from "./data";

const BrandSalesChart = async(() =>
  import("../../sections/Sales/BrandSalesChart")
);

const Divider = styled(MuiDivider)(spacing);

const BrandSalesDetail = () => {
  const { brand } = useParams();
  const [brandProducts, setBrandProducts] = useState([]);
  const { brandSalesChartData, products } = data;

  useEffect(() => {
    if (brand) {
      const prodData = products.filter((item) => item.brand === brand);

      setBrandProducts(prodData);
    }
  }, [brand, products]);

  return (
    <React.Fragment>
      <Helmet title={brand} />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            {brand}
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BrandSalesChart
            title={brand}
            description="Total: $123,456.00"
            data={brandSalesChartData}
          />
        </Grid>
        <Grid item xs={12}>
          <BrandSalesTable brand={brand} data={brandProducts} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BrandSalesDetail;
