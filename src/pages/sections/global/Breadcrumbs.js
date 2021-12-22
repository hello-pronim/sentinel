import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { spacing } from "@mui/system";

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Breadcrumbs = ({ pageTitle, ...props }) => {
  return (
    <StyledBreadcrumbs {...props}>
      <Link component={NavLink} to="/">
        Dashboard
      </Link>
      <Typography>{pageTitle}</Typography>
    </StyledBreadcrumbs>
  );
};

export default Breadcrumbs;
