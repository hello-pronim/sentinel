import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Button,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const ResetPasswordForm = ({ code, email, setStep }) => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  return (
    <>
      <Typography component="h2" variant="body1" align="center">
        Enter your email to reset your password
      </Typography>
      <Formik
        initialValues={{
          password: "",
          confirmpassword: "",
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .required("Password is required")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
          confirmpassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Passwords must match"
          ),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          resetPassword(email, code, values.password)
            .then((res) => navigate("/auth/sign-in"))
            .catch((error) => {
              const message = error.message || "Something went wrong";

              setStatus({ success: false });
              setErrors({ submit: message });
              setSubmitting(false);
            });
        }}
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
            {errors.submit && (
              <Alert mt={2} mb={1} severity="warning">
                {errors.submit}
              </Alert>
            )}
            <TextField
              type="password"
              name="password"
              label="Password"
              value={values.password}
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              onBlur={handleBlur}
              onChange={handleChange}
              my={3}
            />
            <TextField
              type="password"
              name="confirmpassword"
              label="Confirm"
              value={values.confirmpassword}
              error={Boolean(touched.confirmpassword && errors.confirmpassword)}
              fullWidth
              helperText={touched.confirmpassword && errors.confirmpassword}
              onBlur={handleBlur}
              onChange={handleChange}
              my={3}
            />

            <Grid container spacing={4}>
              <Grid item md={6} sm={12}>
                <Button
                  type="button"
                  fullWidth
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
              </Grid>
              <Grid item md={6} sm={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
