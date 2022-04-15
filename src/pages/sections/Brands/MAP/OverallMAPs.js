import React from "react";
import GaugeChart from "react-gauge-chart";

import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { red, green } from "@mui/material/colors";

import { convertPercentFormat } from "../../../../utils/functions";

const OverallMAPs = ({ current, previous, loading }) => {
  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="center">
            <Grid item md={8} xs={12}>
              {!loading ? (
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
                          formatTextValue={() => ""}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="h3">
                          {convertPercentFormat(current)}
                        </Typography>
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
                          formatTextValue={() => ""}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="h3">
                          {convertPercentFormat(previous)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="center">
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default OverallMAPs;
