import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import SignUpForm from "./SignUpForm";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const SignUp = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Sign Up" />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Get started
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Start creating the best possible user experience for you customers
        </Typography>

        <SignUpForm />
      </Wrapper>
    </React.Fragment>
  );
};

export default SignUp;
