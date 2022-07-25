import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";

import {
  CardContent,
  CardHeader,
  Card as MuiCard,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AuthContext } from "../../../contexts/CognitoContext";
import { getSalesByCompany } from "../../../services/SalesService";
import {
  convertMMDDYYYYDateStringToTime,
  convertPriceFormat,
  getColorFromString,
} from "../../../utils/functions";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;
const LinkText = styled(Typography)`
  cursor: pointer;
`;

const SalesByCompanyChart = ({ title }) => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [showCompanyRevenueChart, setShowCompanyRevenueChart] = useState({});
  const [chartData, setChartData] = useState(null);
  const [xAxis, setXAxis] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loadingSalesData, setLoadingSalesData] = useState(false);
  const options = {
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";

            if (label) label += ": ";
            if (context.parsed.y !== null)
              label += convertPriceFormat(context.parsed.y);

            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      y: {
        display: true,
        borderDash: [5, 5],
        grid: {
          color: "rgba(0,0,0,0)",
          fontColor: "#fff",
        },
      },
    },
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  const refreshSalesData = useCallback(() => {
    setLoadingSalesData(true);
    getSalesByCompany(queryParamsString).then((res) => {
      const { data } = res.data.body;

      setLoadingSalesData(false);
      if (data) {
        const _salesData = {
          companyRevenueSeries: data.company_revenue_series,
        };

        setSalesData(_salesData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refreshSalesData();
    }
  }, [isInitialized, isAuthenticated, refreshSalesData]);

  useEffect(() => {
    if (salesData !== null && salesData.companyRevenueSeries) {
      let dates = [];
      const { companyRevenueSeries } = salesData;
      let newShowCompanyRevenueChart = {};

      Object.keys(companyRevenueSeries).forEach((companyId) => {
        const { revenue_series: revenueSeries } =
          companyRevenueSeries[companyId];

        Object.keys(revenueSeries).forEach((date) => dates.push(date));
        newShowCompanyRevenueChart[companyRevenueSeries[companyId].name] = true;
      });

      const chartXAxis = [...new Set(dates)]; // available dates for revenue, forecast and comparison chart

      setXAxis(
        chartXAxis.sort(
          (a, b) =>
            convertMMDDYYYYDateStringToTime(a) -
            convertMMDDYYYYDateStringToTime(b)
        )
      );

      setShowCompanyRevenueChart(newShowCompanyRevenueChart);
      setChartData({
        labels: chartXAxis,
        datasets: Object.keys(companyRevenueSeries).map((companyId) => ({
          label: companyRevenueSeries[companyId].name,
          fill: true,
          backgroundColor: "transparent",
          borderColor: getColorFromString(companyRevenueSeries[companyId].name),
          tension: 0.4,
          data: chartXAxis.map((x) =>
            showCompanyRevenueChart[companyRevenueSeries[companyId].name]
              ? companyRevenueSeries[companyId].revenue_series[x]
              : []
          ),
        })),
      });
    }
  }, [salesData]);

  useEffect(() => {
    if (salesData !== null) {
      const { companyRevenueSeries } = salesData;
      if (companyRevenueSeries) {
        setChartData({
          labels: xAxis,
          datasets: Object.keys(companyRevenueSeries).map((companyId) => ({
            label: companyRevenueSeries[companyId].name,
            fill: true,
            backgroundColor: "transparent",
            borderColor: getColorFromString(
              companyRevenueSeries[companyId].name
            ),
            tension: 0.4,
            data: xAxis.map((x) =>
              showCompanyRevenueChart[companyRevenueSeries[companyId].name]
                ? companyRevenueSeries[companyId].revenue_series[x]
                : []
            ),
          })),
        });
      }
    }
  }, [salesData, showCompanyRevenueChart, xAxis]);

  const handleCompanyClicked = (companyName) => {
    let newShowCompanyRevenueChart = { ...showCompanyRevenueChart };
    newShowCompanyRevenueChart[companyName] =
      !showCompanyRevenueChart[companyName];
    setShowCompanyRevenueChart(newShowCompanyRevenueChart);
  };

  return (
    <Card variant="outlined" mb={1}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {salesData !== null && !loadingSalesData ? (
          <>
            <Grid container alignItems="center" spacing={2}>
              {Object.keys(showCompanyRevenueChart).map(
                (companyName, index) => (
                  <Grid item key={index}>
                    <LinkText
                      onClick={() => handleCompanyClicked(companyName)}
                      style={{
                        color: getColorFromString(companyName),
                        textDecoration:
                          !showCompanyRevenueChart[companyName] &&
                          "line-through",
                      }}
                    >
                      {companyName}
                    </LinkText>
                  </Grid>
                )
              )}
            </Grid>

            <Spacer mb={6} />

            {chartData !== null && (
              <Grid container>
                <Grid item xs={12}>
                  <ChartWrapper>
                    <Chart type="line" data={chartData} options={options} />
                  </ChartWrapper>
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          <Grid container justifyContent="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesByCompanyChart;
