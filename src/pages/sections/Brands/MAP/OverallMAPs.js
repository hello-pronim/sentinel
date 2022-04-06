import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import GaugeChart from "react-gauge-chart";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

const OverallMAPs = ({ current, previous }) => {
  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardContent>
          <Grid container>
            <Grid item md={6} xs={12}>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography>Overall MAP</Typography>
                    </Grid>
                    <Grid item>
                      <GaugeChart
                        animate={false}
                        nrOfLevels={20}
                        percent={current}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography>Previous Overall MAP</Typography>
                    </Grid>
                    <Grid item>
                      <GaugeChart
                        animate={false}
                        nrOfLevels={20}
                        percent={previous}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default OverallMAPs;
