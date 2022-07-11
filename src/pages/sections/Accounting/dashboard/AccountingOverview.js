import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { blue, red, green, yellow } from "@mui/material/colors";
import {
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
  KeyboardReturnOutlined as KeyboardReturnOutlinedIcon,
  PollOutlined as PollOutlinedIcon,
} from "@mui/icons-material";

import AccountingOverviewStatsCard from "../../../../components/card/AccountingOverviewStatsCard";

const AccountingOverview = ({ title, data }) => {
  const { totalSales, unitsOrdered, unitsRefunded, avgSellingPrice } = data;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5">{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <AccountingOverviewStatsCard
                  data={totalSales}
                  icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 40 }} />}
                  iconColor={red[500]}
                  variant="outlined"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
              <Grid item xs={3}>
                <AccountingOverviewStatsCard
                  data={unitsOrdered}
                  icon={<ShoppingCartOutlinedIcon sx={{ fontSize: 40 }} />}
                  iconColor={green[400]}
                  variant="outlined"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
              <Grid item xs={3}>
                <AccountingOverviewStatsCard
                  data={unitsRefunded}
                  icon={<KeyboardReturnOutlinedIcon sx={{ fontSize: 40 }} />}
                  iconColor={blue[400]}
                  variant="outlined"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
              <Grid item xs={3}>
                <AccountingOverviewStatsCard
                  data={avgSellingPrice}
                  icon={<PollOutlinedIcon sx={{ fontSize: 40 }} />}
                  iconColor={yellow[500]}
                  variant="outlined"
                  positiveColor={green[500]}
                  negativeColor={red[500]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountingOverview;
