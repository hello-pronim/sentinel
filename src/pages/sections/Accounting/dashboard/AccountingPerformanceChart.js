import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";
import {
  CardContent,
  Card as MuiCard,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { blue, red, green } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";

import { convertPriceFormat } from "../../../../utils/functions";

const Card = styled(MuiCard)(spacing);
const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;
const LinkText = styled(Typography)`
  cursor: pointer;
`;

const colors = [green[600], red[600], blue[600]];

const AccountingPerformanceChart = ({ title, data, loading }) => {
  const [chartData, setChartData] = useState(null);
  const [showRevenueChart, setShowRevenueChart] = useState(true);
  const [showExpenseChart, setShowExpenseChart] = useState(true);
  const [showProductCostChart, setShowProductCostChart] = useState(true);
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
            label += convertPriceFormat(context.parsed.y);
            return label;
          },
        },
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              return convertPriceFormat(value);
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (
      data !== null &&
      data.revenueSeries &&
      data.expenseSeries &&
      data.productCostSeries
    ) {
      let revenueSeriesDates = Object.keys(data.revenueSeries);
      let expenseSeriesDates = Object.keys(data.expenseSeries);
      let productCostSeriesDates = Object.keys(data.productCostSeries);
      let dates = [];
      let xAxis = [];

      dates = [
        ...revenueSeriesDates,
        ...expenseSeriesDates,
        ...productCostSeriesDates,
      ];
      xAxis = [...new Set(dates)];

      setChartData({
        labels: xAxis,
        datasets: [
          {
            label: "Revenue",
            fill: true,
            backgroundColor: alpha(colors[0], 0.1),
            borderColor: colors[0],
            tension: 0.4,
            data: showRevenueChart
              ? xAxis.map((x) => data.revenueSeries[x])
              : [],
          },
          {
            label: "Expense",
            fill: true,
            backgroundColor: alpha(colors[1], 0.1),
            borderColor: colors[1],
            tension: 0.4,
            data: showExpenseChart
              ? xAxis.map((x) => data.expenseSeries[x])
              : [],
          },
          {
            label: "Product Cost",
            fill: true,
            backgroundColor: alpha(colors[2], 0.1),
            borderColor: colors[2],
            tension: 0.4,
            data: showProductCostChart
              ? xAxis.map((x) => data.productCostSeries[x])
              : [],
          },
        ],
      });
    }
  }, [data, showRevenueChart, showExpenseChart, showProductCostChart]);

  const handleRevenueChartLabelClicked = () => {
    setShowRevenueChart(!showRevenueChart);
  };

  const handleExpenseChartLabelClicked = () => {
    setShowExpenseChart(!showExpenseChart);
  };

  const handleProductCostChartLabelClicked = () => {
    setShowProductCostChart(!showProductCostChart);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3">{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            {data !== null && !loading ? (
              <>
                <Grid container justifyContent="center" spacing={8}>
                  <Grid item>
                    <LinkText
                      onClick={handleRevenueChartLabelClicked}
                      style={{
                        color: colors[0],
                        textDecoration: !showRevenueChart && "line-through",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <LocationSearchingIcon fontSize="small" />
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">Revenue</Typography>
                        </Grid>
                      </Grid>
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <LinkText
                      onClick={handleExpenseChartLabelClicked}
                      style={{
                        color: colors[1],
                        textDecoration: !showExpenseChart && "line-through",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <LocationSearchingIcon fontSize="small" />
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">Expense</Typography>
                        </Grid>
                      </Grid>
                    </LinkText>
                  </Grid>
                  <Grid item>
                    <LinkText
                      onClick={handleProductCostChartLabelClicked}
                      style={{
                        color: colors[2],
                        textDecoration: !showProductCostChart && "line-through",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <LocationSearchingIcon fontSize="small" />
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">Product Cost</Typography>
                        </Grid>
                      </Grid>
                    </LinkText>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountingPerformanceChart;
