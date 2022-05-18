import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Card, Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { AuthContext } from "../../../../contexts/CognitoContext";

import BrandsTable from "../../../sections/admin/Brands/BrandsTable";
import { brandsData } from "./mock";

const Divider = styled(MuiDivider)(spacing);

const AdminBrands = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const initializeMAPData = useCallback(() => {}, [queryParamsString]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeMAPData();
    }
  }, [isAuthenticated, isInitialized, initializeMAPData]);

  return (
    <React.Fragment>
      <Helmet title="Admin - Brands" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Companies / Brands
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BrandsTable title="Brands" data={brandsData} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AdminBrands;
