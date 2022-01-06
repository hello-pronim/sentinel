import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import ResetPasswordForm from "./ResetPasswordForm";
import VerificationCodeForm from "./VerificationCodeForm";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const [step, setStep] = useState(0); //0: verification code form,  1:reset password form
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const encodedEmail = new URLSearchParams(search).get("e");
    if (encodedEmail) {
      const buff = new Buffer(encodedEmail, "base64");
      const decodedEmail = buff.toString("ascii");

      setEmail(decodedEmail);
    } else {
      navigate("/auth/forgot-password");
    }
  }, [navigate, search]);

  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Reset Password" />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>

        {step === 0 && (
          <VerificationCodeForm
            code={code}
            email={email}
            setCode={setCode}
            setStep={setStep}
          />
        )}
        {step === 1 && (
          <ResetPasswordForm code={code} email={email} setStep={setStep} />
        )}
      </Wrapper>
    </React.Fragment>
  );
};

export default ResetPassword;
