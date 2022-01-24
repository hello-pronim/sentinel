import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";

import { CardContent, Card as MuiCard, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { red, green, blue } from "@mui/material/colors";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const SalesChart = ({ title, description, data }) => {
  const [chartData, setChartData] = useState(null);
  const colors = [red[400], green[400], blue[400]];
  const options = {
    maintainAspectRatio: false,
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
    console.log("AAAAA");
  }, []);

  useEffect(() => {
    if (data.comparisonSeries && data.revenueSeries) {
      let comparisonSeriesDates = Object.keys(data.comparisonSeries);
      let revenueSeriesDates = Object.keys(data.revenueSeries);
      let dates = [];
      let xAxis = [];

      console.log(data);

      comparisonSeriesDates = comparisonSeriesDates.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      revenueSeriesDates = revenueSeriesDates.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      dates = [...comparisonSeriesDates, ...revenueSeriesDates];
      xAxis = [...new Set(dates)]; // available dates for revenue and comparison chart
      console.log(xAxis);

      setChartData({
        labels: xAxis,
        datasets: [
          {
            label: "Revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[0],
            tension: 0.4,
            data: xAxis.map((x) => data.revenueSeries[x] ?? 0),
          },
          {
            label: "Comparison Revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[1],
            tension: 0.4,
            data: xAxis.map((x) => data.comparisonSeries[x] ?? 0),
          },
        ],
      });
    }
  }, [data]);

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Chart type="line" data={chartData} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
