import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  Alert as MuiAlert,
  Divider as MuiDivider,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AuthContext } from "../../../../contexts/CognitoContext";

import BrandsTable from "../../../sections/admin/Brands/BrandsTable";
import BrandDetailsForm from "../../../sections/admin/Brands/BrandDetailsForm";
import { brandsData } from "./mock";

const Divider = styled(MuiDivider)(spacing);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminBrands = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [brands, setBrands] = useState(brandsData);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [showBrandDetailsFormPanel, setShowBrandDetailsFormPanel] =
    useState(false);
  const [brandsDetailsFormMode, setBrandsDetailsFormMode] = useState(""); // add: Add a new brand, edit: Edit brand
  const defaultFormData = {
    name: "",
    nickname: "",
    category: "",
    dataMAP: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [showAlert, setShowAlert] = useState(false);
  const initializeMAPData = useCallback(() => {}, [queryParamsString]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeMAPData();
    }
  }, [isAuthenticated, isInitialized, initializeMAPData]);

  const handleAdd = () => {
    setBrandsDetailsFormMode("add");
    setFormData({ ...defaultFormData });
    setShowBrandDetailsFormPanel(true);
  };
  const handleEdit = (nickname) => {
    setBrandsDetailsFormMode("edit");
    setFormData(
      brands.find((brand) => brand.nickname === nickname) || defaultFormData
    );
    setShowBrandDetailsFormPanel(true);
  };
  const handleSubmit = (formData) => {
    let newBrands = [...brands];
    const isExist =
      newBrands.filter((brand) => brand.nickname === formData.nickname).length >
      0;

    if (!isExist) newBrands.push(formData);
    else
      newBrands = brands.map((brand) => {
        if (brand.nickname === formData.nickname) return { ...formData };
        return { ...brand };
      });

    setBrands([...newBrands]);
    setShowAlert(true);
    setShowBrandDetailsFormPanel(false);
  };
  const handleCancel = () => {
    setShowBrandDetailsFormPanel(false);
  };
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <React.Fragment>
      <Helmet title="Admin - Brands" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Brands
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        {showBrandDetailsFormPanel && (
          <Grid item xs={12}>
            <BrandDetailsForm
              mode={brandsDetailsFormMode}
              data={formData}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <BrandsTable
            title="Brands"
            data={brands}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
          />
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={showAlert}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="success">
          {brandsDetailsFormMode === "add"
            ? "The new band has been added successfully."
            : brandsDetailsFormMode === "edit"
            ? "The brand details have been updated successfully."
            : "Success"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default AdminBrands;
