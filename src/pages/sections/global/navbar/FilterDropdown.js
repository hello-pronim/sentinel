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
  const [companyFilterData, setCompanyFilterData] = useState(null);
  const [defaultCompanyExpandedList, setDefaultCompanyExpandedList] = useState(
    []
  );
  const [defaultCompanySelectedList, setDefaultCompanySelectedList] = useState(
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
  const [defaultMarketSelectedList, setDefaultMarketSelectedList] = useState(
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
    // pre-select filter options from url params
    if (search && companyList.length && marketList.length) {
      const searchParams = new URLSearchParams(search);
      const companyIdArray = searchParams.getAll("company_ids[]").map(Number);
      const marketIdArray = searchParams.getAll("market_ids[]").map(Number);

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
          selectedMarkets.push("-" + mar.name);
          selectedMarketOptions.push({
            id: "-" + mar.name,
            option: mar,
          });
        }
      });

      setSelectedCompanies(selectedCompanies);
      setSelectedCompanyOptions(selectedCompanyOptions);
      setSelectedMarkets(selectedMarkets);
      setSelectedMarketOptions(selectedMarketOptions);
      setDateFilterOptions({
        ...dateFilterOptions,
        dateRange: searchParams.get("date_range"),
        viewMode: searchParams.get("view_by"),
        from: searchParams.get("from"),
        to: searchParams.get("to"),
        compFrom:
          searchParams.get("comp_from") !== undefined
            ? searchParams.get("comp_from")
            : dateFilterOptions.date.compFrom,
        compTo:
          searchParams.get("comp_to") !== undefined
            ? searchParams.get("comp_to")
            : dateFilterOptions.date.compTo,
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
          dateRange: searchParams.get("date_range"),
          viewBy: searchParams.get("view_by"),
          from: searchParams.get("from"),
          to: searchParams.get("to"),
          compFrom:
            searchParams.get("comp_from") !== undefined
              ? searchParams.get("comp_from")
              : defaultFilterOptions.date.compFrom,
          compTo:
            searchParams.get("comp_to") !== undefined
              ? searchParams.get("comp_to")
              : defaultFilterOptions.date.compTo,
        },
        market: {
          ...filterOptions.market,
          selected: selectedMarkets,
          selectedOptions: selectedMarketOptions,
        },
      });
    }
  }, [search, companyList, marketList]);

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
      setDefaultCompanyExpandedList(defaultExpanded);
      setDefaultCompanySelectedList(defaultSelected);
      if (!search) {
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
      }
      setCompanyFilterOptions(options);
      setCompanyFilterData(data);
    }
  }, [search, companies, filterOptions, setFilterOptions]);

  useEffect(() => {
    const { date } = filterOptions;

    setDateFilterOptions(date);
  }, [filterOptions]);

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
      setDefaultMarketExpandedList(defaultExpanded);
      setDefaultMarketSelectedList(defaultSelected);
      if (!search) {
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
      }
      setMarketFilterOptions(options);
      setMarketFilterData(data);
    }
  }, [search, markets, filterOptions, setFilterOptions]);

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

    navigate(url);
    setAnchorEl(null);
  };
  const handleClearClicked = () => {
    setFilterOptions({
      ...filterOptions,
      company: {
        ...filterOptions.company,
        selected: defaultCompanySelectedList,
        selectedOptions: companyFilterOptions,
      },
      date: { ...defaultFilterOptions.date },
      market: {
        ...filterOptions.market,
        selected: defaultMarketSelectedList,
        selectedOptions: marketFilterOptions,
      },
    });
    setSelectedCompanyOptions(companyFilterOptions);
    setDateFilterOptions(defaultFilterOptions.date);
    setSelectedMarketOptions(marketFilterOptions);

    navigate("/sales");
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
