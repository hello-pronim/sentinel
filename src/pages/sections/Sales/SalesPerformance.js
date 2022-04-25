import React from "react";
import { Grid } from "@mui/material";
import { red, green } from "@mui/material/colors";

import SalesChangeCard from "../../../components/card/SalesChangeCard";
import {
  estimatedSalesChangeData,
  mtdSalesChangeData,
  salesChanges,
} from "./mock";

const SalesPerformance = ({ title }) => {
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Grid container spacing={8}>
          <Grid item xs={6}>
            <SalesChangeCard
              label={mtdSalesChangeData.label}
              description="vs Prior Period"
              data={mtdSalesChangeData.data}
              variant="contained"
              size="medium"
              positiveColor={green[500]}
              negativeColor={red[500]}
            />
          </Grid>
          <Grid item xs={6}>
            <SalesChangeCard
              label={estimatedSalesChangeData.label}
              description="vs Last Month's Sales"
              data={estimatedSalesChangeData.data}
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
          {salesChanges.map((item) => (
            <Grid key={item.id} item xs={12} sm={12} md={4} lg={2} xl>
              <SalesChangeCard
                label={item.label}
                data={item.data}
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
  );
};

export default SalesPerformance;
