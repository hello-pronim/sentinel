import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Menu } from "@mui/material";

import { AppContext } from "../../../../contexts/AppContext";

import CompanyFilterMenu from "./CompanyFilterMenu";
import DateFilterMenu from "./DateFilterMenu";
import MarketFilterMenu from "./MarketFilterMenu";

const FilterDropdown = ({ text }) => {
  const { companies, markets } = useContext(AppContext);
  const [companyFilterOptions, setCompanyFilterOptions] = useState(null);
  const [defaultCompanyExpandedList, setCompanyDefaultExpandedList] = useState(
    []
  );
  const [defaultCompanySelectedList, setCompanyDefaultSelectedList] = useState(
    []
  );
  const [marketFilterOptions, setMarketFilterOptions] = useState(null);
  const [defaultMarketExpandedList, setMarketDefaultExpandedList] = useState(
    []
  );
  const [defaultMarketSelectedList, setMarketDefaultSelectedList] = useState(
    []
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (companies !== null) {
      const defaultExpanded = ["all"];
      const defaultSelected = ["all"];
      const categories = Object.keys(companies);
      const companyArray = [];
      categories.forEach((category) =>
        companies[category].forEach((company) => companyArray.push(company))
      );
      const options = {
        id: "all",
        name: "All",
        children: categories.map((category) => {
          const sameCatCompanies = companyArray.filter(
            (comp) => comp.category_name === category
          );
          defaultExpanded.push(category);
          defaultSelected.push(category);

          return {
            id: category,
            name: category,
            children: sameCatCompanies.map((comp) => {
              defaultSelected.push(comp.name);
              return {
                id: comp.name,
                name: comp.name,
              };
            }),
          };
        }),
      };
      setCompanyDefaultExpandedList(defaultExpanded);
      setCompanyDefaultSelectedList(defaultSelected);
      setCompanyFilterOptions(options);
    }
  }, [companies]);

  useEffect(() => {
    if (markets !== null) {
      const defaultExpanded = ["all"];
      const defaultSelected = ["all"];
      const options = {
        id: "all",
        name: "All",
        children: markets.map((market) => {
          defaultSelected.push(market.name);
          return {
            id: market.name,
            name: market.name,
          };
        }),
      };
      setMarketDefaultExpandedList(defaultExpanded);
      setMarketDefaultSelectedList(defaultSelected);
      setMarketFilterOptions(options);
    }
  }, [markets]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleApplyFilterlicked = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        id="button-filter-dropdown"
        aria-controls="menu-dropdown"
        aria-haspopup="true"
        aira-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        variant="contained"
      >
        {text}
      </Button>
      <Menu
        id="menu-filter-dropdown"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "button-dropdown",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box>
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item>
              {companyFilterOptions !== null && (
                <CompanyFilterMenu
                  title="Company by Category"
                  filterOptions={companyFilterOptions}
                  defaultExpanded={defaultCompanyExpandedList}
                  defaultSelected={defaultCompanySelectedList}
                />
              )}
            </Grid>
            <Grid item>
              <DateFilterMenu title="Date" />
            </Grid>
            <Grid item>
              {marketFilterOptions && (
                <MarketFilterMenu
                  title="Markets"
                  filterOptions={marketFilterOptions}
                  defaultExpanded={defaultMarketExpandedList}
                  defaultSelected={defaultMarketSelectedList}
                />
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box p={2}>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item>
              <Button variant="outlined">Clear</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilterlicked}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </React.Fragment>
  );
};

export default FilterDropdown;
