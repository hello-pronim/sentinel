import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Card,
  Divider as MuiDivider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";
import { AuthContext } from "../../../contexts/CognitoContext";

import async from "../../../components/Async";

const MAP = async(() => import("../../sections/Brands/MAP/index"));

const Divider = styled(MuiDivider)(spacing);

const Brands = () => {
  const queryParamsString = window.location.search;
  const tabs = [
    { id: 0, label: "MAP", value: "map" },
    { id: 1, label: "Something else coming later tab", value: "other" },
  ];
  const { companies, filterOptions, setFilterOptions } = useContext(AppContext);
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleTabChanged = (event, value) => {
    console.log(value);
    setSelectedTab(value);
  };

  useEffect(() => {
    const selectedCompanyList = filterOptions.company.selectedOptions.map(
      (item) => item.option
    );

    setSelectedCompanies(selectedCompanyList);

    if (companies) {
      const companyCategories = Object.keys(companies);
      const allCompanies = [];

      companyCategories.forEach((category) => {
        companies[category].forEach((company) => allCompanies.push(company));
      });
    }
    // .catch((err) => signOut());
  }, [filterOptions, companies]);

  return (
    <React.Fragment>
      <Helmet title="Brands" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Brands
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TabContext value={selectedTab}>
              <TabList
                onChange={handleTabChanged}
                variant="scrollable"
                scrollButtons="auto"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </TabList>
              <Divider />
              <TabPanel value="map">
                <Grid container>
                  <Grid item xs={12}>
                    <MAP />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="other">Coming soon</TabPanel>
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Brands;
