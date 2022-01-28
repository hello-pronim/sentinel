import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";

import { CardContent, Card as MuiCard, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { red, green, blue } from "@mui/material/colors";

import { convertPriceFormat } from "../../../utils/functions";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const SalesChart = ({ title, data }) => {
  const [chartData, setChartData] = useState(null);
  const colors = [green[400], red[400], blue[400]];
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
    if (data.comparisonSeries && data.revenueSeries) {
      let comparisonSeriesDates = Object.keys(data.comparisonSeries);
      let revenueSeriesDates = Object.keys(data.revenueSeries);
      let dates = [];
      let xAxis = [];

      comparisonSeriesDates = comparisonSeriesDates.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      revenueSeriesDates = revenueSeriesDates.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      dates = [...comparisonSeriesDates, ...revenueSeriesDates];
      xAxis = [...new Set(dates)]; // available dates for revenue and comparison chart

      setChartData({
        labels: xAxis,
        datasets: [
          {
            label: "Revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[0],
            tension: 0.4,
            data: xAxis.map((x) => data.revenueSeries[x]),
          },
          {
            label: "Comparison Revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[1],
            tension: 0.4,
            data: xAxis.map((x) => data.comparisonSeries[x]),
          },
        ],
      });
    }
  }, [data]);

  return (
    <Card mb={1}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography style={{ color: colors[0] }}>
                  Total Revenue:
                </Typography>
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
                <Typography style={{ color: colors[1] }}>
                  Previous Revenue:
                </Typography>
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
      </CardContent>
    </Card>
  );
};

export default SalesChart;
