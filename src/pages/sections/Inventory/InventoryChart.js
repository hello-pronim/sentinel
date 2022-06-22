import React, { useEffect, useState } from "react";
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
import { red, green, blue } from "@mui/material/colors";

import { convertMMDDYYYYDateStringToTime } from "../../../utils/functions";

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
  const [showCurrentShipped, setShowCurrentShipped] = useState(true);
  const [showPreviousShipped, setShowPreviousShipped] = useState(true);
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
            if (context.parsed.y !== null && label.includes("Shipped", 0))
              label += context.parsed.y;
            else label += context.parsed.y;
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
    if (data !== null && data.comparisonSeries && data.series) {
      let comparisonSeriesDates = Object.keys(data.comparisonSeries);
      let currentSeriesDates = Object.keys(data.series);
      let dates = [];
      let xAxis = [];

      comparisonSeriesDates = comparisonSeriesDates.sort(
        (a, b) =>
          convertMMDDYYYYDateStringToTime(a) -
          convertMMDDYYYYDateStringToTime(b)
      );
      currentSeriesDates = currentSeriesDates.sort(
        (a, b) =>
          convertMMDDYYYYDateStringToTime(a) -
          convertMMDDYYYYDateStringToTime(b)
      );

      dates = [...comparisonSeriesDates, ...currentSeriesDates];
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
            data: showCurrentShipped ? xAxis.map((x) => data.series[x]) : [],
          },
          {
            label: "Previous Shipped",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[1],
            tension: 0.4,
            data: showCurrentShipped
              ? xAxis.map((x) => data.comparisonSeries[x])
              : [],
          },
        ],
      });
    }
  }, [data, showCurrentShipped, showPreviousShipped]);

  const handleCurrentShippedLabelClicked = () => {
    setShowCurrentShipped(!showCurrentShipped);
  };

  const handlePreviousShippedLabelClicked = () => {
    setShowPreviousShipped(!showPreviousShipped);
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
                      onClick={handleCurrentShippedLabelClicked}
                      style={{
                        color: colors[0],
                        textDecoration: !showCurrentShipped && "line-through",
                      }}
                    >
                      Total Shipped:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>{data.stats.total_shipped_units}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <LinkText
                      onClick={handlePreviousShippedLabelClicked}
                      style={{
                        color: colors[1],
                        textDecoration: !showPreviousShipped && "line-through",
                      }}
                    >
                      Previous Shipped:
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {data.stats.total_shipped_units_comparison}
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
