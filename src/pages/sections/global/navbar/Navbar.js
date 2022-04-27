import React, { useContext, useEffect, useState } from "react";
import styled, { withTheme } from "styled-components/macro";
import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import { AppContext } from "../../../../contexts/AppContext";
import { AuthContext } from "../../../../contexts/CognitoContext";

import { getCompanies } from "../../../../services/CompanyService";
import { getMarkets } from "../../../../services/MarketService";

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
  const {
    companies,
    markets,
    filterOptions,
    defaultFilterOptions,
    setCompanies,
    setMarkets,
    setFilterOptions,
  } = useContext(AppContext);
  const { isAuthenticated, isInitialized } = useContext(AuthContext);
  const [filterButtonText, setFilterButtonText] = useState(
    `All Brands - ${filterOptions.date.from} - ${filterOptions.date.to} - All Markets`
  );

  const retrieveCompaniesData = () => {
    getCompanies()
      .then((res) => {
        const { data } = res.data.body;

        setCompanies(data);
      })
      .catch((err) => err);
  };

  const retrieveMarketsData = () => {
    getMarkets()
      .then((res) => {
        const { data } = res.data.body;

        setMarkets(data);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      retrieveCompaniesData();
      retrieveMarketsData();
    }
  }, [isAuthenticated, isInitialized]);

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
            <Tooltip title="Data Filters">
              <Grid item>
                <FilterDropdown
                  text={filterButtonText}
                  companies={companies}
                  markets={markets}
                  filterOptions={filterOptions}
                  defaultFilterOptions={defaultFilterOptions}
                  setFilterButtonText={setFilterButtonText}
                  setFilterOptions={setFilterOptions}
                />
              </Grid>
            </Tooltip>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
