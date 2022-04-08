import React from "react";
import GaugeChart from "react-gauge-chart";

import { Card, CardContent, Grid, Typography } from "@mui/material";
import { red, green } from "@mui/material/colors";

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
                        colors={[red["A700"], green["A700"]]}
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
                        colors={[red["A700"], green["A700"]]}
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
