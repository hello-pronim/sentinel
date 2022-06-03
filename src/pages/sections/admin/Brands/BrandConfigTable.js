import React, { useState } from "react";
import styled from "styled-components/macro";
import { Formik } from "formik";
import * as Yup from "yup";
import MaterialTable from "@material-table/core";

import {
  Alert as MuiAlert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  IconButton,
  MenuItem,
  TextField as MuiTextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { spacing } from "@mui/system";

const Alert = styled(MuiAlert)(spacing);
const Divider = styled(MuiDivider)(spacing);
const TextField = styled(MuiTextField)(spacing);

const BrandConfigTable = ({ title, data, loading, handleSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState({
    id: "",
    type: "",
    value: "",
  });

  const columns = [
    {
      field: "id",
      title: "#",
      width: "10%",
      render: (rowData) => {
        const { id } = rowData;

        return id;
      },
    },
    {
      field: "type",
      title: "Configuration Type",
      width: "30%",
    },
    {
      field: "value",
      title: "Value",
      width: "50%",
    },
    {
      title: "Actions",
      width: "10%",
      render: (rowData) => {
        return (
          <IconButton
            aria-label="edit"
            onClick={() => handleEditClicked(rowData)}
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  const handleAddClicked = () => {
    setShowModal(true);
  };
  const handleDialogClose = () => {
    setShowModal(false);
  };

  const handleEditClicked = (brandConfigData) => {
    setApiKey({
      id: brandConfigData?.id || "",
      type: brandConfigData?.type || "",
      value: brandConfigData?.value || "",
    });
    setShowModal(true);
  };

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      handleSubmit(values);
      setShowModal(false);
    } catch (error) {
      const message = error.message || "Something went wrong";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardHeader
          title={title}
          action={
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClicked}
            >
              New
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {data !== null && !loading ? (
                <MaterialTable
                  columns={columns}
                  data={data}
                  options={{
                    pageSize: 10,
                    search: true,
                    showTitle: false,
                    emptyRowsWhenPaging: false,
                  }}
                />
              ) : (
                <Grid container justifyContent="center">
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog open={showModal} onClose={handleDialogClose} fullWidth>
        <Formik
          initialValues={{ ...apiKey, submit: false }}
          validationSchema={Yup.object().shape({
            type: Yup.string()
              .max(255)
              .required("Configuration Type is required"),
            value: Yup.string().max(255).required("Value is required"),
          })}
          onSubmit={onSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>{values.id === "" ? "Add" : "Edit"}</DialogTitle>
              <Divider />
              <DialogContent>
                <Grid container spacing={4}>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <Alert severity="warning">{errors.submit}</Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      select
                      name="type"
                      label="Configuration Type"
                      value={values.type}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.type && errors.type)}
                      helperText={touched.type && errors.type}
                      fullWidth
                      my={2}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Amazon SP API">Amazon SP API</MenuItem>
                      <MenuItem value="Walmart API">Walmart API</MenuItem>
                      <MenuItem value="Shopify API">Shopify API</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="value"
                      label="Value"
                      value={values.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.value && errors.value)}
                      helperText={touched.value && errors.value}
                      fullWidth
                      my={2}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleDialogClose}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="outlined"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
};

export default BrandConfigTable;
