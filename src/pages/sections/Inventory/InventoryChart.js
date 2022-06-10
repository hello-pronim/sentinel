import React, { useEffect, useState } from "react";
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

const InventoryChart = ({
  title,
  data,
  filterOptions,
  loading,
  setFilterOptions,
}) => {
  const [chartData, setChartData] = useState(null);
  const [showCurrentRevenue, setShowCurrentRevenue] = useState(true);
  const [showPreviousRevenue, setShowPreviousRevenue] = useState(true);
  const [showReturns, setShowReturns] = useState(filterOptions.showReturns);
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
    setShowReturns(filterOptions.showReturns);
  }, [filterOptions]);

  useEffect(() => {
    if (data !== null && data.comparisonSeries && data.revenueSeries) {
      let comparisonSeriesDates = Object.keys(data.comparisonSeries);
      let revenueSeriesDates = Object.keys(data.revenueSeries);
      let forecastSeriesDates = Object.keys(data?.forecastSeries);
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
            label: "Current Shipped",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[0],
            tension: 0.4,
            data: showCurrentRevenue
              ? xAxis.map((x) => data.revenueSeries[x])
              : [],
          },
          {
            label: "Previous Shipped",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[1],
            tension: 0.4,
            data: showCurrentRevenue
              ? xAxis.map((x) => data.comparisonSeries[x])
              : [],
          },
        ],
      });
    }
  }, [data, showCurrentRevenue, showPreviousRevenue]);

  const handleCurrentRevenueLabelClicked = () => {
    setShowCurrentRevenue(!showCurrentRevenue);
  };

  const handlePreviousRevenueLabelClicked = () => {
    setShowPreviousRevenue(!showPreviousRevenue);
  };

  return (
    <Card variant="outlined" mb={1}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {data !== null && !loading ? (
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
                      Total Shipped:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {convertPriceFormat(data.stats.total_revenue)}
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
                      Previous Shipped:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {convertPriceFormat(data.stats.total_comparison_revenue)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
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

export default InventoryChart;
