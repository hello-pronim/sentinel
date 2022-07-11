import React, { useCallback, useContext, useEffect, useState } from "react";

import { CircularProgress, Grid } from "@mui/material";

import { AuthContext } from "../../../../contexts/CognitoContext";
import { getAccountingData } from "../../../../services/AccountingService";
// import { accountingOverviewData, accountingPerformanceChartData } from "./mock";
import async from "../../../../components/Async";

import AccountingOverview from "./AccountingOverview";
const AccountingPerformanceChart = async(() =>
  import("./AccountingPerformanceChart")
);

const AccountingDashboard = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [accountingOverviewData, setAccountingOverviewData] = useState(null);
  const [accountingPerformanceChartData, setAccountingPerformanceChartData] =
    useState(null);
  const [loadingAccountingData, setLoadingAccountingData] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const refreshAccountingDashboardData = useCallback(() => {
    setLoadingAccountingData(true);
    getAccountingData(queryParamsString).then((res) => {
      console.log(res);
      const { data } = res.data.body;

      setLoadingAccountingData(false);
      if (data) {
        const overviewData = {
          totalSales: {
            change: data.stats.total_sales_change,
            label: "Total Sales",
            stats: data.stats.total_sales,
            unit: "price",
          },
          unitsOrdered: {
            change: data.stats.units_ordered_change,
            label: "Units Ordered",
            stats: data.stats.units_ordered,
            unit: "unit",
          },
          unitsRefunded: {
            change: data.stats.units_refunded_change,
            label: "Units Refunded",
            stats: data.stats.units_refunded,
            unit: "unit",
          },
          avgSellingPrice: {
            change: data.stats.avg_price_change,
            label: "Avg Selling Price",
            stats: data.stats.avg_price,
            unit: "price",
          },
        };
        const performanceChartData = {
          revenueSeries: data.revenue_series,
          expenseSeries: data.expenses_series,
        };

        setAccountingOverviewData(overviewData);
        setAccountingPerformanceChartData(performanceChartData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refreshAccountingDashboardData();
    }
  }, [isInitialized, isAuthenticated, refreshAccountingDashboardData]);

  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {!loadingAccountingData && accountingOverviewData !== null ? (
            <Grid container>
              <Grid item xs={12}>
                <AccountingOverview
                  title="Overview"
                  data={accountingOverviewData}
                />
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
        <Grid item xs={12}>
          {!loadingAccountingData && accountingPerformanceChartData !== null ? (
            <Grid container>
              <Grid item xs={12}>
                <AccountingPerformanceChart
                  title="Margin Performance"
                  data={accountingPerformanceChartData}
                />
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
    </React.Fragment>
  );
};

export default AccountingDashboard;
