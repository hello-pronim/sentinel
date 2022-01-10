import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Grid, Menu, useMediaQuery } from "@mui/material";

import CompanyFilterMenu from "./CompanyFilterMenu";
import DateFilterMenu from "./DateFilterMenu";
import MarketFilterMenu from "./MarketFilterMenu";

const FilterDropdown = ({
  text,
  companies,
  markets,
  filterOptions,
  setFilterButtonText,
  setFilterOptions,
}) => {
  const navigate = useNavigate();
  const mobileScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // companies
  const [companyList, setCompanyList] = useState([]);
  const [companyFilterOptions, setCompanyFilterOptions] = useState([]);
  const [companyFilterData, setCompanyFilterData] = useState(null);
  const [defaultCompanyExpandedList, setCompanyDefaultExpandedList] = useState(
    []
  );
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(
    filterOptions.company.selectedOptions
  );
  // date
  const [dateFilterOptions, setDateFilterOptions] = useState(
    filterOptions.date
  );
  // markets
  const [marketList, setMarketList] = useState([]);
  const [marketFilterOptions, setMarketFilterOptions] = useState([]);
  const [marketFilterData, setMarketFilterData] = useState(null);
  const [defaultMarketExpandedList, setMarketDefaultExpandedList] = useState(
    []
  );
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedMarketOptions, setSelectedMarketOptions] = useState(
    filterOptions.market.selectedOptions
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (companies !== null) {
      const keys = Object.keys(companies);
      let array = [];

      keys.forEach((key) => {
        const sameCatCompanies = companies[key];

        sameCatCompanies.forEach((comp) => array.push(comp));
      });

      setCompanyList(array);
    }
  }, [companies]);
  useEffect(() => {
    if (markets !== null) {
      setMarketList(markets);
    }
  }, [markets]);

  useEffect(() => {
    if (companies !== null && !filterOptions.company.selected.length) {
      const defaultExpanded = ["all"];
      const defaultSelected = ["all"];
      const options = [];
      const categories = Object.keys(companies);
      const companyArray = [];
      categories.forEach((category) =>
        companies[category].forEach((company) => companyArray.push(company))
      );
      const data = {
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
              defaultSelected.push(category + "-" + comp.name);
              options.push({ id: category + "-" + comp.name, option: comp });
              return {
                id: category + "-" + comp.name,
                name: comp.name,
              };
            }),
          };
        }),
      };
      setCompanyDefaultExpandedList(defaultExpanded);
      setSelectedCompanies(defaultSelected);
      setSelectedCompanyOptions(options);
      setFilterOptions({
        ...filterOptions,
        company: {
          ...filterOptions.company,
          selected: defaultSelected,
          selectedOptions: options,
        },
      });
      setCompanyFilterOptions(options);
      setCompanyFilterData(data);
    }
  }, [companies, filterOptions, setFilterOptions]);

  useEffect(() => {
    if (markets !== null && !filterOptions.market.selected.length) {
      const defaultExpanded = ["all"];
      const defaultSelected = ["all"];
      const options = [];
      const data = {
        id: "all",
        name: "All",
        children: markets.map((market) => {
          defaultSelected.push("-" + market.name);
          options.push({ id: "-" + market.name, option: market });
          return {
            id: "-" + market.name,
            name: market.name,
          };
        }),
      };
      setMarketDefaultExpandedList(defaultExpanded);
      setSelectedMarkets(defaultSelected);
      setSelectedMarketOptions(options);
      setFilterOptions({
        ...filterOptions,
        market: {
          ...filterOptions.market,
          selected: defaultSelected,
          selectedOptions: options,
        },
      });
      setMarketFilterOptions(options);
      setMarketFilterData(data);
    }
  }, [markets, filterOptions, setFilterOptions]);

  useEffect(() => {
    let companyFilterButtonText = "";
    let dateFilterButtonText =
      dateFilterOptions.from !== dateFilterOptions.to
        ? dateFilterOptions.from + " - " + dateFilterOptions.to
        : dateFilterOptions.from;
    let marketFilterButtonText = "";

    if (!selectedCompanyOptions.length) companyFilterButtonText = "All Brands";
    else {
      if (selectedCompanyOptions.length === 1)
        companyFilterButtonText = selectedCompanyOptions[0].option.name;
      else if (selectedCompanyOptions.length === companyList.length)
        companyFilterButtonText = "All Brands";
      else companyFilterButtonText = "Multi Brands";
    }
    if (!selectedMarketOptions.length) marketFilterButtonText = "All Markets";
    else {
      if (selectedMarketOptions.length === 1)
        marketFilterButtonText = selectedMarketOptions[0].option.name;
      else if (selectedMarketOptions.length === marketList.length)
        marketFilterButtonText = "All Markets";
      else marketFilterButtonText = "Multi Markets";
    }

    setFilterButtonText(
      companyFilterButtonText +
        " - " +
        dateFilterButtonText +
        " - " +
        marketFilterButtonText
    );
  }, [
    companyList,
    marketList,
    selectedCompanyOptions,
    dateFilterOptions,
    selectedMarketOptions,
    setFilterButtonText,
  ]);

  useEffect(() => {
    setSelectedCompanies(filterOptions.company.selected);
    setSelectedMarkets(filterOptions.market.selected);
  }, [filterOptions]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleApplyClicked = () => {
    setFilterOptions({
      ...filterOptions,
      company: {
        ...filterOptions.company,
        selected: selectedCompanies,
        selectedOptions: selectedCompanyOptions,
      },
      date: {
        ...filterOptions.date,
        dateFilterOptions,
      },
      market: {
        ...filterOptions.market,
        selected: selectedMarkets,
        selectedOptions: selectedMarketOptions,
      },
    });

    let url = "/sales?";

    selectedCompanyOptions.forEach((opt, index) => {
      url +=
        "company_ids[]=" +
        opt.option.id +
        (index < selectedCompanyOptions.length - 1 ? "&" : "");
    });

    url += "&from=" + dateFilterOptions.from + "&to=" + dateFilterOptions.to;
    url += selectedMarketOptions.length ? "&" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        "market_ids[]=" +
        opt.option.id +
        (index < selectedMarketOptions.length - 1 ? "&" : "");
    });

    navigate(url);
    setAnchorEl(null);
  };
  const handleClearClicked = () => {
    const selectedCompOptions = filterOptions.company.selectedOptions;
    const selectedMarOptions = filterOptions.market.selectedOptions;
    setSelectedCompanies(selectedCompOptions.map((opt) => opt.id));
    setSelectedMarkets(selectedMarOptions.map((opt) => opt.id));
  };

  return (
    <React.Fragment>
      <Button
        id="button-filter-dropdown"
        aria-controls="menu-dropdown"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
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
          <Grid
            container
            wrap="nowrap"
            spacing={1}
            direction={mobileScreen ? "column" : "row"}
          >
            <Grid item sm={12} md={4}>
              {companyFilterData !== null && (
                <CompanyFilterMenu
                  title="Company by Category"
                  filterData={companyFilterData}
                  filterOptions={companyFilterOptions}
                  expanded={defaultCompanyExpandedList}
                  selected={selectedCompanies}
                  setSelected={setSelectedCompanies}
                  setSelectedOptions={setSelectedCompanyOptions}
                />
              )}
              {mobileScreen ? <Divider /> : <></>}
            </Grid>
            <Grid item sm={12} md={4}>
              <DateFilterMenu
                title="Date"
                filterOptions={dateFilterOptions}
                setFilterOptions={setDateFilterOptions}
              />
              {mobileScreen ? <Divider /> : <></>}
            </Grid>
            <Grid item sm={12} md={4}>
              {marketFilterData && (
                <MarketFilterMenu
                  title="Markets"
                  filterData={marketFilterData}
                  filterOptions={marketFilterOptions}
                  expanded={defaultMarketExpandedList}
                  selected={selectedMarkets}
                  setSelected={setSelectedMarkets}
                  setSelectedOptions={setSelectedMarketOptions}
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
              <Button variant="outlined" onClick={handleClearClicked}>
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyClicked}
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
