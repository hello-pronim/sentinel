import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "styled-components/macro";

import {
  Alert as MuiAlert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider as MuiDivider,
  Grid,
  MenuItem,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import BrandConfigTable from "./BrandConfigTable";

const Alert = styled(MuiAlert)(spacing);
const Divider = styled(MuiDivider)(spacing);
const TextField = styled(MuiTextField)(spacing);

const BrandDetailsForm = ({ mode, data, handleSubmit, handleCancel }) => {
  const [apiKeys, setApiKeys] = useState(data?.apiKeys || []);

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      handleSubmit({ ...values, apiKeys });
    } catch (error) {
      const message = error.message || "Something went wrong";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  const handleBrandConfigSubmit = (brandConfigData) => {
    let newApiKeys = [...apiKeys];
    const maxId = apiKeys.map((item) => item.id).sort((a, b) => a > b)[0] || 0;
    if (brandConfigData.id === "" || apiKeys.length === 0) {
      newApiKeys.push({ ...brandConfigData, id: maxId + 1 });
    } else
      newApiKeys = apiKeys.map((item) =>
        item.id === brandConfigData.id ? brandConfigData : item
      );
    setApiKeys([...newApiKeys]);
  };

  return (
    <React.Fragment>
      <Card variant="outlined">
        <Formik
          initialValues={{ ...data, submit: false }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required("Name is required"),
            nickname: Yup.string().max(255).required("Nickname is required"),
            category: Yup.string().max(255).required("Category is required"),
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
              <CardHeader
                title={mode === "add" ? "Add" : mode === "edit" ? "Edit" : ""}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={4}>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <Alert severity="warning">{errors.submit}</Alert>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <TextField
                      type="text"
                      name="name"
                      label="Brand"
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      fullWidth
                      my={2}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="text"
                      name="nickname"
                      label="Nickname"
                      value={values.nickname}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.nickname && errors.nickname)}
                      helperText={touched.nickname && errors.nickname}
                      fullWidth
                      my={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      name="category"
                      label="Category"
                      value={values.category}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && errors.category}
                      fullWidth
                      my={2}
                    >
                      <MenuItem>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Baby">Baby</MenuItem>
                      <MenuItem value="Pet">Pet</MenuItem>
                      <MenuItem value="Novelty">Novelty</MenuItem>
                      <MenuItem value="Outdoor">Outdoor</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="dataMAP"
                      label="DataMAP"
                      value={values.dataMAP}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.dataMAP && errors.dataMAP)}
                      helperText={touched.dataMAP && errors.dataMAP}
                      fullWidth
                      my={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <BrandConfigTable
                      title="Brand Configuration"
                      data={apiKeys}
                      handleSubmit={handleBrandConfigSubmit}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleCancel}
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
              </CardActions>
            </form>
          )}
        </Formik>
      </Card>
    </React.Fragment>
  );
};

export default BrandDetailsForm;
