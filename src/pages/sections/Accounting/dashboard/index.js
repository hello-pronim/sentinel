import React, { useCallback, useContext, useEffect, useState } from "react";

import { Grid } from "@mui/material";

import { AuthContext } from "../../../../contexts/CognitoContext";
// import {
//   getAccountingOverviewData,
//   getAccountingPerformanceData,
// } from "../../../services/AccountingService";
import { accountingOverviewData, accountingPerformanceChartData } from "./mock";
import async from "../../../../components/Async";

import AccountingOverview from "./AccountingOverview";
const AccountingPerformanceChart = async(() =>
  import("./AccountingPerformanceChart")
);

const AccountingDashboard = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  //   const [accountingOverviewData, setAccountingOverviewData] = useState(null);
  //   const [accountingPerformanceChartData, setAccountingPerformanceChartData] =
  //     useState(null);
  const [loadingAccountingOverviewData, setLoadingAccountingOverviewData] =
    useState(false);
  const [
    loadingAccountingPerformanceChartData,
    setLoadingAccountingPerformanceChartData,
  ] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const refreshAccountingDashboardData = useCallback(() => {
    // setLoadingAccountingOverviewData(true);
    // getAccountingOverviewData(queryParamsString).then((res) => {
    //   const { data } = res.data.body;
    //   setLoadingAccountingOverviewData(false);
    //   if (data) {
    //     const overviewData = {};
    //     setAccountingOverviewData(overviewData);
    //   }
    // });
    // setLoadingAccountingChartData(true);
    // getAccountingChartData(queryParamsString).then((res) => {
    //   const { data } = res.data.body;
    //   setLoadingAccountingChartData(false);
    //   if (data) {
    //     const chartData = {};
    //     setAccountingChartData(chartData);
    //   }
    // });
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
          <AccountingOverview
            title="Overview"
            loading={loadingAccountingOverviewData}
            data={accountingOverviewData}
          />
        </Grid>
        <Grid item xs={12}>
          <AccountingPerformanceChart
            title="Monthly Performance"
            loading={loadingAccountingPerformanceChartData}
            data={accountingPerformanceChartData}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AccountingDashboard;
