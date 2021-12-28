import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import SignInForm from "./SignInForm";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const SignIn = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Sign In" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Sentinel Login
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue
        </Typography>

        <SignInForm />
      </Wrapper>
    </React.Fragment>
  );
};

export default SignIn;
