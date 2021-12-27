import React, { useEffect, useState } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  Box,
  Divider as MuiDivider,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import Breadcrumbs from "../../sections/global/Breadcrumbs";
import SalesTable from "../../sections/SalesTable";
import async from "../../../components/Async";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import TreeViewCheckboxGroup from "../../../components/checkbox/TreeViewCheckboxGroup";
import data from "./data";

import {
  getCompanies,
  selectCompanies,
  getCompaniesAsync,
} from "../../../redux/slices/company";

const SalesChart = async(() => import("../../sections/SalesChart"));

const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const dispatch = useDispatch();
  // const store = useStore();
  // const companies = useSelector(selectCompanies);
  // console.log(store.getState(), companies);
  const [companyFilterOptions, setCompanyFilterOptions] = useState(null);
  const [defaultCompanyExpandedList, setDefaultCompanyExpandedList] = useState(
    []
  );
  const [defaultCompanySelectedList, setDefaultCompanySelectedList] = useState(
    []
  );
  const [marketFilterOptions, setMarketFilterOptions] = useState(null);
  const [defaultMarketExpandedList, setDefaultMarketExpandedList] = useState(
    []
  );
  const [defaultMarketSelectedList, setDefaultMarketSelectedList] = useState(
    []
  );
  const {
    salesChartData,
    brands: brandsTableData,
    companies,
    companyCategories,
    markets,
    marketCategories,
  } = data;
  const brandsTableColumns = [
    { id: "id", label: "#", alignment: "center" },
    { id: "brand", label: "Brand", alignment: "left" },
    { id: "revenue", label: "Revenue", alignment: "center" },
    {
      id: "comparisonRevenue",
      label: "Comparison Revenue",
      alignment: "center",
    },
    { id: "revenueChange", label: "Revenue Change", alignment: "center" },
    { id: "actions", label: "Actions", alignment: "right" },
  ];

  useEffect(() => {
    // dispatch(getCompaniesAsync());
    // dispatch(getCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (
      companies &&
      companies.length > 0 &&
      companyCategories &&
      companyCategories.length > 0
    ) {
      const defaultExpanded = ["company-all"];
      const defaultSelected = ["company-all"];
      const options = {
        id: "company-all",
        name: "All",
        children: companyCategories.map((category) => {
          const sameCatCompanies = companies.filter(
            (comp) => comp.company_category_id === category.id
          );
          defaultExpanded.push("company-" + category.id);
          defaultSelected.push("company-" + category.id);

          return {
            id: "company-" + category.id,
            name: category.name,
            children: sameCatCompanies.map((comp) => {
              defaultSelected.push("company-" + category.id + "-" + comp.id);
              return {
                id: "company-" + category.id + "-" + comp.id,
                name: comp.name,
              };
            }),
          };
        }),
      };
      setDefaultCompanyExpandedList(defaultExpanded);
      setDefaultCompanySelectedList(defaultSelected);
      setCompanyFilterOptions(options);
    }
  }, [companyCategories, companies]);

  useEffect(() => {
    if (
      markets &&
      markets.length > 0 &&
      marketCategories &&
      marketCategories.length > 0
    ) {
      const defaultExpanded = ["market-all"];
      const defaultSelected = ["market-all"];
      const options = {
        id: "market-all",
        name: "All",
        children: marketCategories.map((category) => {
          const sameCatMarkets = markets.filter(
            (market) => market.category_id === category.id
          );
          defaultExpanded.push("market-" + category.id);
          defaultSelected.push("market-" + category.id);

          return {
            id: "market-" + category.id,
            name: category.market,
            children: sameCatMarkets.map((mar) => {
              defaultSelected.push("market-" + category.id + "-" + mar.id);
              return {
                id: "market-" + category.id + "-" + mar.id,
                name: mar.name,
              };
            }),
          };
        }),
      };
      setDefaultMarketExpandedList(defaultExpanded);
      setDefaultMarketSelectedList(defaultSelected);
      setMarketFilterOptions(options);
    }
  }, [marketCategories, markets]);

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales
          </Typography>
          <Breadcrumbs pageTitle="Sales" aria-label="Breadcrumb" mt={2} />
        </Grid>
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <DropdownMenu
                text="Filter dropdown"
                color="primary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item>
                    <Box p={2}>
                      <Typography variant="body2">
                        Company by Category
                      </Typography>
                    </Box>
                    <Divider />
                    <TreeViewCheckboxGroup
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      data={companyFilterOptions}
                      defaultExpanded={defaultCompanyExpandedList}
                      defaultSelected={defaultCompanySelectedList}
                      multiSelect
                    />
                  </Grid>
                  <Grid item>
                    <Box p={2}>
                      <Typography variant="body2">Date</Typography>
                    </Box>
                    <Divider />
                    <TreeViewCheckboxGroup
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      data={companyFilterOptions}
                      defaultExpanded={defaultCompanyExpandedList}
                      defaultSelected={defaultCompanySelectedList}
                      multiSelect
                    />
                  </Grid>
                  <Grid item>
                    <Box p={2}>
                      <Typography variant="body2">Markets</Typography>
                    </Box>
                    <Divider />
                    <TreeViewCheckboxGroup
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      data={marketFilterOptions}
                      defaultExpanded={defaultMarketExpandedList}
                      defaultSelected={defaultMarketSelectedList}
                      multiSelect
                    />
                  </Grid>
                </Grid>
              </DropdownMenu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SalesChart
            title="All companies"
            description="Total: $39,923"
            data={salesChartData}
          />
        </Grid>
        <Grid item xs={12}>
          <SalesTable data={brandsTableData} columns={brandsTableColumns} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
