import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Divider, Grid, Menu, useMediaQuery } from "@mui/material";

import CompanyFilterMenu from "./CompanyFilterMenu";
import DateFilterMenu from "./DateFilterMenu";
import MarketFilterMenu from "./MarketFilterMenu";

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
  const [allCompanyOptions, setAllCompanyOptions] = useState([]);
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
  const [allMarketOptions, setAllMarketOptions] = useState([]);
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
      const keys = Object.keys(markets);
      let array = [];

      keys.forEach((key) => {
        const sameCatMarkets = markets[key];
        sameCatMarkets.forEach((mar) => array.push(mar));
      });

      setMarketList(array);
    }
  }, [markets]);

  useEffect(() => {
    // pre-select filter options from url params
    if (companyList.length && marketList.length) {
      let companyIdArray = [];
      let marketIdArray = [];
      const searchParams = new URLSearchParams(search);
      if (search) {
        companyIdArray = searchParams.getAll("company_ids[]").map(Number);
        marketIdArray = searchParams.getAll("market_ids[]").map(Number);
      } else {
        companyIdArray = companyList.map((comp) => comp.id);
        marketIdArray = marketList.map((mar) => mar.id);
      }
      console.log(companyIdArray, marketIdArray);

      let selectedCompanies = [];
      let selectedCompanyOptions = [];
      let selectedMarkets = [];
      let selectedMarketOptions = [];

      companyList.forEach((comp) => {
        if (companyIdArray.includes(comp.id)) {
          selectedCompanies.push(comp.category_name + "-" + comp.name);
          selectedCompanyOptions.push({
            id: comp.category_name + "-" + comp.name,
            option: comp,
          });
        }
      });
      marketList.forEach((mar) => {
        if (marketIdArray.includes(mar.id)) {
          selectedMarkets.push(mar.category_name + "-" + mar.name);
          selectedMarketOptions.push({
            id: mar.category_name + "-" + mar.name,
            option: mar,
          });
        }
      });

      setSelectedCompanies(selectedCompanies);
      setSelectedCompanyOptions(selectedCompanyOptions);
      setSelectedMarkets(selectedMarkets);
      setSelectedMarketOptions(selectedMarketOptions);
      console.log(searchParams.get("date_range"));
      setDateFilterOptions({
        ...dateFilterOptions,
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
      });

      setFilterOptions({
        ...filterOptions,
        company: {
          ...filterOptions.company,
          selected: selectedCompanies,
          selectedOptions: selectedCompanyOptions,
        },
        date: {
          ...filterOptions.date,
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
        },
        market: {
          ...filterOptions.market,
          selected: selectedMarkets,
          selectedOptions: selectedMarketOptions,
        },
        showReturns: searchParams.get("show_returns")
          ? searchParams.get("show_returns") === "true" // convert boolean string to boolean
          : defaultFilterOptions.showReturns,
      });
    }
  }, [search, companyList, marketList]);

  useEffect(() => {
    if (companies !== null) {
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
      setDefaultCompanyExpandedList(defaultExpanded);
      setAllCompanyOptions(options);
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
  }, [companies]);

  useEffect(() => {
    if (markets !== null && !filterOptions.market.selected.length) {
      const defaultExpanded = ["all"];
      const defaultSelected = ["all"];
      const options = [];
      const categories = Object.keys(markets);
      const marketArray = [];
      categories.forEach((category) =>
        markets[category].forEach((market) => marketArray.push(market))
      );
      const data = {
        id: "all",
        name: "All",
        children: categories.map((category) => {
          const sameCatMarkets = marketArray.filter(
            (mar) => mar.category_name === category
          );
          defaultExpanded.push(category);
          defaultSelected.push(category);
          // options.push({ id: "-" + market.name, option: market });
          return {
            id: category,
            name: category,
            children: sameCatMarkets.map((mar) => {
              defaultSelected.push(category + "-" + mar.name);
              options.push({ id: category + "-" + mar.name, option: mar });
              return {
                id: category + "-" + mar.name,
                name: mar.name,
              };
            }),
          };
        }),
      };
      setDefaultMarketExpandedList(defaultExpanded);
      setAllMarketOptions(options);
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
  }, [markets]);

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

  useEffect(() => {
    setSelectedCompanies(filterOptions.company.selected);
    setSelectedMarkets(filterOptions.market.selected);
    setDateFilterOptions(filterOptions.date);
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
    url += selectedMarketOptions.length ? "&" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        "market_ids[]=" +
        opt.option.id +
        (index < selectedMarketOptions.length - 1 ? "&" : "");
    });
    url += "&show_returns=" + filterOptions.showReturns;

    navigate(url);
    setAnchorEl(null);
  };
  const handleClearClicked = () => {
    setFilterOptions(defaultFilterOptions);
    setSelectedCompanyOptions(companyFilterOptions);
    setDateFilterOptions(defaultFilterOptions.date);
    setSelectedMarketOptions(marketFilterOptions);

    navigate("/sales");
  };

  const onSelectedCompanyOptionsChanged = (selectedOptions) => {
    console.log(selectedOptions);
    let selectedMarketIds = [];
    selectedOptions.forEach(
      (opt) =>
        opt.option?.marketplace_ids &&
        opt.option?.marketplace_ids.forEach((id) => selectedMarketIds.push(id))
    );
    selectedMarketIds = [...new Set(selectedMarketIds)];

    let newMarketsSelected = [];
    let newMarketsOptionsSelected = [];

    allMarketOptions.forEach((marketOption) => {
      if (selectedMarketIds.includes(marketOption.option.id)) {
        newMarketsSelected.push(marketOption.id);
        newMarketsOptionsSelected.push(marketOption);
      }
    });
    console.log(newMarketsSelected);
    console.log(newMarketsOptionsSelected);

    setSelectedMarkets(newMarketsSelected);
    setSelectedMarketOptions(newMarketsOptionsSelected);
    setFilterOptions({
      ...filterOptions,
      company: {
        ...filterOptions.company,
        selected: selectedOptions.map((opt) => opt.id),
        selectedOptions,
      },
      market: {
        ...filterOptions.market,
        selected: newMarketsSelected,
        selectedOptions: newMarketsOptionsSelected,
      },
    });
  };

  const onSelectedMarketOptionsChanged = (selectedOptions) => {
    console.log("selected company ids: ", selectedOptions);
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
                  onSelectedOptionsChanged={onSelectedCompanyOptionsChanged}
                />
              )}
              {mobileScreen ? <Divider /> : <></>}
            </Grid>
            <Grid item sm={12} md={4}>
              {marketFilterData && (
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
              )}
              {mobileScreen ? <Divider /> : <></>}
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
