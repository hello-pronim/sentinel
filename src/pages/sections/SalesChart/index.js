import React from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";

import { CardContent, Card as MuiCard, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { green, grey } from "@mui/material/colors";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100$;
  height: 300px;
`;

const SalesChart = ({ title, description, data }) => {
  const colors = [green[100], grey[100]];
  const chartData = {
    labels: data.xLabels,
    datasets: data.data.map((item, index) => ({
      label: item.label,
      fill: true,
      backgroundColor: "transparent",
      borderColor: colors[index],
      tension: 0.4,
      data: item.values,
    })),
  };

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
