import React, { useContext, useState } from "react";
import styled, { withTheme } from "styled-components/macro";
import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import { AppContext } from "../../../../contexts/AppContext";

import FilterDropdown from "./FilterDropdown";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Navbar = ({ onDrawerToggle }) => {
  const { companies, markets, filterOptions, setFilterOptions } =
    useContext(AppContext);
  const [filterButtonText, setFilterButtonText] = useState(
    `All Brands - ${filterOptions.date.from} - ${filterOptions.date.to} - All Markets`
  );

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <FilterDropdown
                text={filterButtonText}
                companies={companies}
                markets={markets}
                filterOptions={filterOptions}
                setFilterButtonText={setFilterButtonText}
                setFilterOptions={setFilterOptions}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
