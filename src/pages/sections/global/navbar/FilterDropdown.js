import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Box,
  Button,
  Divider,
  Grid,
  Menu as MuiMenu,
  useMediaQuery,
} from "@mui/material";

import CompanyFilterMenu from "./CompanyFilterMenu";
import DateFilterMenu from "./DateFilterMenu";
import MarketFilterMenu from "./MarketFilterMenu";

const Menu = styled(MuiMenu)`
  & .MuiPaper-root {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

const FilterDropdown = ({
  text,
  companies,
  markets,
  filterOptions,
  defaultFilterOptions,
  setFilterButtonText,
  setFilterOptions,
}) => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const mobileScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // companies
  const [companyList, setCompanyList] = useState([]);
  const [companyFilterOptions, setCompanyFilterOptions] = useState([]);
  const [companyFilterData, setCompanyFilterData] = useState(null);
  const [defaultCompanyExpandedList, setDefaultCompanyExpandedList] = useState(
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
  const [defaultMarketExpandedList, setDefaultMarketExpandedList] = useState(
    []
  );
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedMarketOptions, setSelectedMarketOptions] = useState(
    filterOptions.market.selectedOptions
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (markets !== null && companies !== null) {
      let companyList = [];
      let marketList = [];
      let selectedCompanyIds = [];
      let selectedMarketIds = [];
      const searchParams = new URLSearchParams(search);

      Object.keys(companies).forEach((category) => {
        const sameCatCompanies = companies[category];
        sameCatCompanies.forEach((comp) => companyList.push(comp));
      });
      Object.keys(markets).forEach((category) => {
        const sameCatMarkets = markets[category];
        sameCatMarkets.forEach((mar) => marketList.push(mar));
      });
      setCompanyList(companyList);
      setMarketList(marketList);

      if (search) {
        selectedCompanyIds = searchParams
          .get("company_ids[]")
          .split(",")
          .map(Number);
        selectedMarketIds = searchParams
          .get("market_ids[]")
          .split(",")
          .map(Number);
      } else {
        selectedCompanyIds = companyList.map((comp) => comp.id);
        selectedMarketIds = marketList.map((mar) => mar.id);
      }

      // update market filter options with market ids from url
      const marketCategories = Object.keys(markets);
      const companyMarkets = {};
      let availableMarketIdArray = [];
      let availableMarketArray = [];

      Object.keys(companies).forEach((category) => {
        const sameCategoryCompanies = companies[category];

        sameCategoryCompanies
          .filter((company) => selectedCompanyIds.includes(company.id))
          .forEach((company) => {
            availableMarketIdArray = new Set([
              ...availableMarketIdArray,
              ...company.marketplace_ids,
            ]);
          });
      });
      availableMarketIdArray = [...availableMarketIdArray];

      marketCategories.forEach((category) => {
        const sameCategoryMarkets = markets[category];
        sameCategoryMarkets.forEach((mar) => {
          if (availableMarketIdArray.includes(mar.id)) {
            if (!companyMarkets[category]) companyMarkets[category] = [];
            companyMarkets[category].push(mar);
            availableMarketArray.push(mar);
          }
        });
      });

      populateCompanyFilterOptions(companies, selectedCompanyIds);
      populateMarketFilterOptions(companyMarkets, selectedMarketIds);

      const newDateFilterOptions = {
        dateRange: searchParams.get("date_range")
          ? searchParams.get("date_range")
          : defaultFilterOptions.date.dateRange,
        viewMode: searchParams.get("view_by")
          ? searchParams.get("view_by")
          : defaultFilterOptions.date.viewMode,
        from: searchParams.get("from")
          ? searchParams.get("from")
          : defaultFilterOptions.date.from,
        to: searchParams.get("to")
          ? searchParams.get("to")
          : defaultFilterOptions.date.to,
        compFrom: searchParams.get("comp_from")
          ? searchParams.get("comp_from")
          : defaultFilterOptions.date.compFrom,
        compTo: searchParams.get("comp_to")
          ? searchParams.get("comp_to")
          : defaultFilterOptions.date.compTo,
      };

      setDateFilterOptions({
        ...dateFilterOptions,
        ...newDateFilterOptions,
      });

      setFilterOptions({
        ...filterOptions,
        date: {
          ...filterOptions.date,
          ...newDateFilterOptions,
        },
        showReturns: searchParams.get("show_returns")
          ? searchParams.get("show_returns") === "true" // convert boolean string to boolean
          : defaultFilterOptions.showReturns,
      });
    }
  }, [search, markets, companies]);

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
      `${companyFilterButtonText} - ${dateFilterButtonText} - ${marketFilterButtonText}`
    );
  }, [
    companyList,
    marketList,
    selectedCompanyOptions,
    dateFilterOptions,
    selectedMarketOptions,
    setFilterButtonText,
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const populateCompanyFilterOptions = (companiesData, selectedCompanyIds) => {
    const expanded = ["all"];
    const selected = [];
    const options = [];
    const selectedOptions = [];
    const categories = Object.keys(companiesData);
    const companyArray = [];

    categories.forEach((category) =>
      companiesData[category].forEach((company) => companyArray.push(company))
    );
    if (companyArray.length === selectedCompanyIds.length) selected.push("all");

    const data = {
      id: "all",
      name: "All",
      children: categories.map((category) => {
        const sameCatCompanies = companyArray.filter(
          (comp) => comp.category_name === category
        );
        expanded.push(category);
        // selected.push(category);

        return {
          id: category,
          name: category,
          children: sameCatCompanies.map((comp) => {
            if (selectedCompanyIds.includes(comp.id)) {
              selected.push(category + "-" + comp.name);
              selectedOptions.push({
                id: category + "-" + comp.name,
                option: comp,
              });
            }
            options.push({ id: category + "-" + comp.name, option: comp });

            return {
              id: category + "-" + comp.name,
              name: comp.name,
            };
          }),
        };
      }),
    };

    setCompanyFilterData(data);
    setDefaultCompanyExpandedList(expanded);
    setSelectedCompanies(selected);
    setSelectedCompanyOptions(selectedOptions);
    setFilterOptions({
      ...filterOptions,
      company: {
        ...filterOptions.company,
        selected: selected,
        selectedOptions: selectedOptions,
      },
    });
    setCompanyFilterOptions(options);
  };
  const populateMarketFilterOptions = (marketsData, selectedMarketIds) => {
    const expanded = ["all"];
    const selected = [];
    const options = [];
    const selectedOptions = [];
    const categories = Object.keys(marketsData);
    const marketArray = [];

    categories.forEach((category) =>
      marketsData[category].forEach((market) => marketArray.push(market))
    );
    if (marketArray.length === selectedMarketIds.length) selected.push("all");

    const data = marketArray.length
      ? {
          id: "all",
          name: "All",
          children: categories.map((category) => {
            const sameCatMarkets = marketArray.filter(
              (mar) => mar.category_name === category
            );
            expanded.push(category);
            // selected.push(category);

            return {
              id: category,
              name: category,
              children: sameCatMarkets.map((mar) => {
                if (selectedMarketIds.includes(mar.id)) {
                  selected.push(category + "-" + mar.name);
                  selectedOptions.push({
                    id: category + "-" + mar.name,
                    option: mar,
                  });
                }
                options.push({ id: category + "-" + mar.name, option: mar });

                return {
                  id: category + "-" + mar.name,
                  name: mar.name,
                };
              }),
            };
          }),
        }
      : null;
    setMarketFilterData(data);
    setDefaultMarketExpandedList(expanded);
    setSelectedMarkets(selected);
    setSelectedMarketOptions(selectedOptions);
    setFilterOptions({
      ...filterOptions,
      market: {
        ...filterOptions.market,
        selected,
        selectedOptions: selectedOptions,
      },
    });
    setMarketFilterOptions(options);
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

    let url = window.location.pathname + "?company_ids[]=";

    selectedCompanyOptions.forEach((opt, index) => {
      url +=
        opt.option.id + (index < selectedCompanyOptions.length - 1 ? "," : "");
    });

    url +=
      "&date_range=" +
      dateFilterOptions.dateRange +
      "&view_by=" +
      dateFilterOptions.viewMode +
      "&from=" +
      dateFilterOptions.from +
      "&to=" +
      dateFilterOptions.to;
    if (dateFilterOptions.dateRange === "custom")
      url +=
        "&comp_from=" +
        dateFilterOptions.compFrom +
        "&comp_to=" +
        dateFilterOptions.compTo;
    url += selectedMarketOptions.length ? "&market_ids[]=" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        opt.option.id + (index < selectedMarketOptions.length - 1 ? "," : "");
    });
    url += "&show_returns=" + filterOptions.showReturns;

    navigate(url);
    setAnchorEl(null);
  };
  const handleClearClicked = () => {
    navigate(window.location.pathname);
  };
  const onSelectedCompanyOptionsChanged = (selectedOptions) => {
    let selectedMarketIds = [];
    const marketCategories = Object.keys(markets);
    let companyMarkets = {};

    selectedOptions.forEach(
      (opt) =>
        opt.option?.marketplace_ids &&
        opt.option?.marketplace_ids.forEach((id) => selectedMarketIds.push(id))
    );
    selectedMarketIds = [...new Set(selectedMarketIds)];

    marketCategories.forEach((category) => {
      const sameCategoryMarkets = markets[category];
      sameCategoryMarkets.forEach((mar) => {
        if (selectedMarketIds.includes(mar.id)) {
          if (!companyMarkets[category]) companyMarkets[category] = [];
          companyMarkets[category].push(mar);
        }
      });
    });

    populateMarketFilterOptions(companyMarkets, selectedMarketIds);
  };
  const onSelectedMarketOptionsChanged = (selectedOptions) => {};

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
            spacing={0}
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
                  onSelectedOptionsChanged={onSelectedCompanyOptionsChanged}
                />
              )}
              {mobileScreen ? <Divider /> : <></>}
            </Grid>
            <Grid item>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item sm={12} md={4}>
              <MarketFilterMenu
                title="Markets by Category"
                filterData={marketFilterData}
                filterOptions={marketFilterOptions}
                expanded={defaultMarketExpandedList}
                selected={selectedMarkets}
                setSelected={setSelectedMarkets}
                setSelectedOptions={setSelectedMarketOptions}
                onSelectedOptionsChanged={onSelectedMarketOptionsChanged}
              />
              {mobileScreen ? <Divider /> : <></>}
            </Grid>
            <Grid item>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item sm={12} md={4}>
              <DateFilterMenu
                title="Date"
                filterOptions={dateFilterOptions}
                setFilterOptions={setDateFilterOptions}
              />
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
