import React from "react";
import { Grid, Typography } from "@mui/material";
import { red, green } from "@mui/material/colors";

import SalesChangeCard from "../../../components/card/SalesChangeCard";

const SalesPerformance = ({ title, data }) => {
  const {
    estimatedSalesChangeData,
    mtdSalesChangeData,
    ytdSalesChangeData,
    salesChanges,
  } = data;
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Typography variant="h3">{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <SalesChangeCard
                  label={mtdSalesChangeData.label}
                  description="vs Prior Period"
                  data={mtdSalesChangeData.data}
                  hasTrendLine={true}
                  trendLineData={mtdSalesChangeData.trendLineData}
                  variant="contained"
                  size="medium"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <SalesChangeCard
                  label={ytdSalesChangeData.label}
                  description="vs Prior Period"
                  data={ytdSalesChangeData.data}
                  hasTrendLine={true}
                  trendLineData={ytdSalesChangeData.trendLineData}
                  variant="contained"
                  size="medium"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <SalesChangeCard
                  label={estimatedSalesChangeData.label}
                  description="vs Last Month's Sales"
                  data={estimatedSalesChangeData.data}
                  hasTrendLine={false}
                  variant="contained"
                  size="medium"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8}>
              {salesChanges.map((item, index) => (
                <Grid key={index} item xs={12} sm={12} md={4} lg={2} xl>
                  <SalesChangeCard
                    label={item.label}
                    data={item.data}
                    hasTrendLine={false}
                    variant="outlined"
                    size="small"
                    positiveColor={green[500]}
                    negativeColor={red[500]}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SalesPerformance;
