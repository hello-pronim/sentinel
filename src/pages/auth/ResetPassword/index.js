import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import ResetPasswordForm from "./ResetPasswordForm";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const ResetPassword = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Reset Password" />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Enter your email to reset your password
        </Typography>

        <ResetPasswordForm />
      </Wrapper>
    </React.Fragment>
  );
};

export default ResetPassword;
