import React, { useContext, useState } from "react";
import styled from "styled-components/macro";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Card,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Tab,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AppContext } from "../../../../contexts/AppContext";
import BuyboxSuppresionsTable from "./BuyboxSuppresionsTable";
import MapListingsTable from "./MapListingsTable";

const Divider = styled(MuiDivider)(spacing);

const ProductsMAPTable = () => {
  const {
    features: { showSuppressions },
  } = useContext(AppContext);
  const tabs = [
    {
      id: 0,
      label: "Current Listing Violations",
      value: "current_listing_violations",
      show: true,
    },
    {
      id: 1,
      label: "Buybox Suppressions",
      value: "buybox_suppressions",
      show: showSuppressions,
    },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const handleTabChanged = (event, value) => {
    setSelectedTab(value);
  };

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <TabContext value={selectedTab}>
                <TabList
                  onChange={handleTabChanged}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {tabs.map(
                    (tab) =>
                      tab.show && (
                        <Tab
                          key={tab.value}
                          label={tab.label}
                          value={tab.value}
                        />
                      )
                  )}
                </TabList>
                <Divider />
                <TabPanel value="current_listing_violations">
                  <Grid container>
                    <Grid item xs={12}>
                      <MapListingsTable />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value="buybox_suppressions">
                  <Grid container>
                    <Grid item xs={12}>
                      <BuyboxSuppresionsTable />
                    </Grid>
                  </Grid>
                </TabPanel>
              </TabContext>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ProductsMAPTable;
