import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Chart from "react-chartjs-2";
import { FilterDropdown } from "../global/navbar/FilterDropdown";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CardContent,
  Card as MuiCard,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { spacing } from "@mui/system";
import { red, green, blue } from "@mui/material/colors";

import { convertPriceFormat } from "../../../utils/functions";
import { Filter } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const SalesChart = ({ title, data, filterOptions, setFilterOptions }) => {
  const [chartData, setChartData] = useState(null);
  const [showReturns, setShowReturns] = useState(filterOptions.showReturns);

  // companies
  const [companyList, setCompanyList] = useState([]);
  const [companyFilterOptions, setCompanyFilterOptions] = useState([]);
  const [companyFilterData, setCompanyFilterData] = useState(null);
  const [defaultCompanyExpandedList, setDefaultCompanyExpandedList] = useState(
    []
  );
  const [defaultCompanySelectedList, setDefaultCompanySelectedList] = useState(
    []
  );
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(
    filterOptions.company.selectedOptions
  );
  // date
  const [dateFilterOptions, setDateFilterOptions] = useState(
    filterOptions.date
  );
  // markets
  const [marketList, setMarketList] = useState([]);
  const [marketFilterOptions, setMarketFilterOptions] = useState([]);
  const [marketFilterData, setMarketFilterData] = useState(null);
  const [defaultMarketExpandedList, setDefaultMarketExpandedList] = useState(
    []
  );
  const [defaultMarketSelectedList, setDefaultMarketSelectedList] = useState(
    []
  );
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedMarketOptions, setSelectedMarketOptions] = useState(
    filterOptions.market.selectedOptions
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const { from, to, viewMode, dateRange, compFrom, compTo, showReturns } =
      filterOptions;
    setShowReturns(showReturns);
  }, [filterOptions]);

  const handleShowReturnsChanged = (event, value) => {
    setShowReturns(value);
    setFilterOptions({
      ...filterOptions,
      showReturns: value,
    });
    console.log(filterOptions.showReturns);
    // handleApplyClicked();
  };
  const handleApplyClicked = () => {
    setFilterOptions({
      ...filterOptions,
      company: {
        ...filterOptions.company,
        selected: selectedCompanies,
        selectedOptions: selectedCompanyOptions,
      },
      date: {
        ...filterOptions.date,
        dateFilterOptions,
      },
      market: {
        ...filterOptions.market,
        selected: selectedMarkets,
        selectedOptions: selectedMarketOptions,
      },
    });

    let url = "/sales?";

    selectedCompanyOptions.forEach((opt, index) => {
      url +=
        "company_ids[]=" +
        opt.option.id +
        (index < selectedCompanyOptions.length - 1 ? "&" : "");
    });

    url +=
      "&date_range=" +
      dateFilterOptions.dateRange +
      "&view_by=" +
      dateFilterOptions.viewMode +
      "&show_returns=" +
      dateFilterOptions.showReturns +
      "&from=" +
      dateFilterOptions.from +
      "&to=" +
      dateFilterOptions.to;
    if (dateFilterOptions.dateRange === "custom")
      url +=
        "&comp_from=" +
        dateFilterOptions.compFrom +
        "&comp_to=" +
        dateFilterOptions.compTo;
    url += selectedMarketOptions.length ? "&" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        "market_ids[]=" +
        opt.option.id +
        (index < selectedMarketOptions.length - 1 ? "&" : "");
    });

    navigate(url);
    setAnchorEl(null);
  };
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
            label: "Current revenue",
            fill: true,
            backgroundColor: "transparent",
            borderColor: colors[0],
            tension: 0.4,
            data: xAxis.map((x) => data.revenueSeries[x]),
          },
          {
            label: "Previous Revenue",
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
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={showReturns}
                onChange={handleShowReturnsChanged}
              />
            }
            label="Show Refunded Orders"
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
