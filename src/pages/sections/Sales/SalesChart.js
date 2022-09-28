import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { spacing } from "@mui/system";
import { red, green, blue } from "@mui/material/colors";

import { AuthContext } from "../../../contexts/CognitoContext";
import { getSales } from "../../../services/SalesService";
import {
  convertMMDDYYYYDateStringToTime,
  convertPriceFormat,
  convertPercentFormat,
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

const colors = [green[400], red[400], blue[400]];

const SalesChart = ({ title, filterOptions, setFilterOptions }) => {
  const queryParamsString = window.location.search;
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [chartData, setChartData] = useState(null);
  const [showCurrentRevenue, setShowCurrentRevenue] = useState(true);
  const [showPreviousRevenue, setShowPreviousRevenue] = useState(true);
  const [showForecastRevenue, setShowForecastRevenue] = useState(true);
  const [showReturns, setShowReturns] = useState(filterOptions.showReturns);
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
            if (context.parsed.y !== null && label.includes("Revenue", 0))
              label += convertPriceFormat(context.parsed.y);
            else label += convertPercentFormat(context.parsed.y);
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

  useEffect(() => {
    setShowReturns(filterOptions.showReturns);
  }, [filterOptions]);

  const refreshSalesData = useCallback(() => {
    setLoadingSalesData(true);
    getSales(queryParamsString).then((res) => {
      const { data, parameters } = res.data.body;

      setLoadingSalesData(false);
      if (data) {
        const _salesData = {
          comparisonSeries: data.comparison_series,
          revenueSeries: data.revenue_series,
          changeSeries: data.revenue_change,
          forecastSeries: data?.revenue_forecast || {},
          stats: data.stats,
          forecast48h: parameters?.forecast_48h || false,
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
    if (
      salesData !== null &&
      salesData.comparisonSeries &&
      salesData.revenueSeries
    ) {
      let comparisonSeriesDates = Object.keys(salesData.comparisonSeries);
      let revenueSeriesDates = Object.keys(salesData.revenueSeries);
      let forecastSeriesDates = Object.keys(salesData?.forecastSeries);
      let dates = [];
      let xAxis = [];

      comparisonSeriesDates = comparisonSeriesDates.sort(
        (a, b) =>
          convertMMDDYYYYDateStringToTime(a) -
          convertMMDDYYYYDateStringToTime(b)
      );
      revenueSeriesDates = revenueSeriesDates.sort(
        (a, b) =>
          convertMMDDYYYYDateStringToTime(a) -
          convertMMDDYYYYDateStringToTime(b)
      );
      forecastSeriesDates = forecastSeriesDates.sort(
        (a, b) =>
          convertMMDDYYYYDateStringToTime(a) -
          convertMMDDYYYYDateStringToTime(b)
      );

      dates = [
        ...comparisonSeriesDates,
        ...revenueSeriesDates,
        ...forecastSeriesDates,
      ];
      xAxis = [...new Set(dates)]; // available dates for revenue, forecast and comparison chart

      setChartData({
        labels: xAxis,
        datasets: [
          {
            label: "Current Revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[0],
            tension: 0.4,
            data: showCurrentRevenue
              ? xAxis.map((x) => salesData.revenueSeries[x])
              : [],
          },
          {
            label: "Previous Gross Sales",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[1],
            tension: 0.4,
            data: showPreviousRevenue
              ? xAxis.map((x) => salesData.comparisonSeries[x])
              : [],
          },
          {
            label: "Forecast Gross Sales",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[2],
            tension: 0.4,
            data: showForecastRevenue
              ? xAxis.map((x) => salesData.forecastSeries[x])
              : [],
          },
        ],
      });
    }
  }, [salesData, showCurrentRevenue, showPreviousRevenue, showForecastRevenue]);

  const handleShowReturnsChanged = (event, value) => {
    const search = location.search;
    let url = "";
    if (filterOptions.company.selectedOptions.length) url += "company_ids[]=";
    filterOptions.company.selectedOptions.forEach((opt, index) => {
      url +=
        opt.option.id +
        (index < filterOptions.company.selectedOptions.length - 1 ? "," : "");
    });

    url +=
      "&date_range=" +
      filterOptions.date.dateRange +
      "&view_by=" +
      filterOptions.date.viewMode +
      "&from=" +
      filterOptions.date.from +
      "&to=" +
      filterOptions.date.to;
    url += "&";
    if (filterOptions.market.selectedOptions.length) url += "market_ids[]=";
    filterOptions.market.selectedOptions.forEach((opt, index) => {
      url +=
        opt.option.id +
        (index < filterOptions.market.selectedOptions.length - 1 ? "," : "");
    });
    url += "&show_returns=" + value;

    const new_url =
      "/sales" +
      (search.length !== 0
        ? search.replace(/show_returns=(true|false)/, "show_returns=" + value)
        : "?" + url);

    setShowReturns(value);
    setFilterOptions({
      ...filterOptions,
      showReturns: value,
    });

    navigate(new_url);
  };

  const handleCurrentRevenueLabelClicked = () => {
    setShowCurrentRevenue(!showCurrentRevenue);
  };

  const handlePreviousRevenueLabelClicked = () => {
    setShowPreviousRevenue(!showPreviousRevenue);
  };

  const handleForecastRevenueLabelClicked = () => {
    setShowForecastRevenue(!showForecastRevenue);
  };

  return (
    <Card variant="outlined" mb={1}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {salesData !== null && !loadingSalesData ? (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <LinkText
                      onClick={handleCurrentRevenueLabelClicked}
                      style={{
                        color: colors[0],
                        textDecoration: !showCurrentRevenue && "line-through",
                      }}
                    >
                      Total Gross Sales:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {convertPriceFormat(salesData.stats.total_revenue)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <LinkText
                      onClick={handlePreviousRevenueLabelClicked}
                      style={{
                        color: colors[1],
                        textDecoration: !showPreviousRevenue && "line-through",
                      }}
                    >
                      Previous Gross Sales:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {convertPriceFormat(
                        salesData.stats.total_comparison_revenue
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {salesData.forecast48h ? (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <LinkText
                        onClick={handleForecastRevenueLabelClicked}
                        style={{
                          color: colors[2],
                          textDecoration:
                            !showForecastRevenue && "line-through",
                        }}
                      >
                        Forecast Gross Sales
                      </LinkText>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(showReturns)}
                    onChange={handleShowReturnsChanged}
                  />
                }
                label="Include: Returned, Partial, and Pending Orders"
              />
            </Grid>
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

export default SalesChart;
