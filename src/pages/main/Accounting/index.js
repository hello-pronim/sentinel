import React, { useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  Card,
  Divider as MuiDivider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { spacing } from "@mui/system";

import AccountingDashboard from "../../sections/Accounting/dashboard";

const Divider = styled(MuiDivider)(spacing);

const tabs = [
  { label: "Dashboard", value: "dashboard" },
  // { label: "Future Margin by Month", value: "future_margin_month" },
  // { label: "Future Margin by Sku", value: "future_margin_sku" },
];

const Accounting = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const handleTabChanged = (event, tab) => {
    setSelectedTab(tab);
  };

  return (
    <React.Fragment>
      <Helmet title="Accounting" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Accounting
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
              <TabPanel value="dashboard">
                <AccountingDashboard />
              </TabPanel>
              <Divider />
              {/* <TabPanel value="future_margin_month">
              </TabPanel>
              <Divider />
              <TabPanel value="future_margin_sku">
              </TabPanel> */}
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Accounting;
