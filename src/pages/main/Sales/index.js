import React, { useEffect, useState } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import Breadcrumbs from "../../sections/global/Breadcrumbs";
import SalesTable from "../../sections/SalesTable";
import async from "../../../components/Async";
import DropdownButton from "../../../components/button/DropdownButton";
import TreeViewCheckboxGroup from "../../../components/checkbox/TreeViewCheckboxGroup";
import data from "./data";

// import {
//   getCompanies,
//   selectCompanies,
//   getCompaniesAsync,
// } from "../../../redux/slices/company";

const SalesChart = async(() => import("../../sections/SalesChart"));

const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  // const dispatch = useDispatch();
  // const store = useStore();
  // const companies = useSelector(selectCompanies);
  // console.log(companies);
  const {
    salesChartData,
    brands: brandsTableData,
    companies,
    categories,
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
  const defaultExpandedList = ["0"];
  const defaultSelectedList = ["0"];
  const companiesFilterOptions = {
    id: "0",
    name: "All",
    children: categories.map((category, catIndex) => {
      const sameCatCompanies = companies.filter(
        (comp) => comp.company_category_id === category.id
      );
      defaultExpandedList.push(catIndex + 1 + "0");
      defaultSelectedList.push(catIndex + 1 + "0");

      return {
        id: catIndex + 1 + "0",
        name: category.name,
        children: sameCatCompanies.map((comp, compIndex) => {
          defaultSelectedList.push(catIndex + 1 + "" + (compIndex + 1));
          return {
            id: catIndex + 1 + "" + (compIndex + 1),
            name: comp.name,
          };
        }),
      };
    }),
  };
  console.log(defaultExpandedList);
  console.log(defaultSelectedList);

  // useEffect(() => {
  //   dispatch(getCompaniesAsync());
  //   dispatch(getCompanies());
  // }, []);

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
              <DropdownButton
                text="Filter dropdown"
                variant="contained"
                color="primary"
              >
                <TreeViewCheckboxGroup
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  data={companiesFilterOptions}
                  defaultExpanded={defaultExpandedList}
                  defaultSelected={defaultSelectedList}
                  multiSelect
                />
              </DropdownButton>
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
