import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Divider } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import {
  convertDateToMMDDYY,
  getPastDate,
  getDatesOfWeek,
} from "../../../../utils/functions";

const DateFilterDropdown = styled(Box)`
  width: 320px;
  height: calc(100vh - 200px);
  overflow-y: scroll;
  padding: 20px;
`;

const DateFilterMenu = ({ title, filterOptions, setFilterOptions }) => {
  const [dateRange, setDateRange] = useState(filterOptions.dateRange);
  const [viewMode, setViewMode] = useState(filterOptions.viewMode);
  const [dateFrom, setDateFrom] = useState(filterOptions.from);
  const [dateTo, setDateTo] = useState(filterOptions.to);
  const [compDateFrom, setCompDateFrom] = useState(filterOptions.compFrom);
  const [compDateTo, setCompDateTo] = useState(filterOptions.compTo);

  useEffect(() => {
    const { from, to, viewMode, dateRange, compFrom, compTo } = filterOptions;

    setDateFrom(from);
    setDateTo(to);
    setViewMode(viewMode);
    setDateRange(dateRange);
    if (dateRange === "custom") {
      setCompDateFrom(compFrom);
      setCompDateTo(compTo);
    }
  }, [filterOptions]);

  const handleDateRangeChanged = (event) => {
    const { value } = event.target;

    const today = new Date();
    let from = convertDateToMMDDYY(getPastDate(today, 29));
    let to = convertDateToMMDDYY(today);
    if (value === "yesterday") {
      from = convertDateToMMDDYY(getPastDate(today, 1));
      to = convertDateToMMDDYY(getPastDate(today, 1));
    } else if (value === "last_week") {
      from = convertDateToMMDDYY(getDatesOfWeek(today).dateFrom);
      to = convertDateToMMDDYY(getDatesOfWeek(today).dateTo);
    } else if (value === "last_month") {
      from = convertDateToMMDDYY(new Date().setMonth(today.getMonth() - 1, 1));
      to = convertDateToMMDDYY(new Date().setMonth(today.getMonth(), 0));
    } else if (value === "last_7_days") {
      from = convertDateToMMDDYY(getPastDate(today, 6));
      to = convertDateToMMDDYY(today);
    } else if (value === "last_30_days") {
      from = convertDateToMMDDYY(getPastDate(today, 29));
      to = convertDateToMMDDYY(today);
    } else if (value === "month_to_date") {
      from = convertDateToMMDDYY(new Date().setMonth(today.getMonth(), 1));
      to = convertDateToMMDDYY(today);
    } else if (value === "year_to_date") {
      from = convertDateToMMDDYY(new Date(today.getFullYear(), 0, 1));
      to = convertDateToMMDDYY(today);
    } else if (value === "this_year") {
      from = convertDateToMMDDYY(new Date(today.getFullYear(), 0, 1));
      to = convertDateToMMDDYY(new Date(today.getFullYear(), 11, 31));
    }

    setDateRange(value);
    setFilterOptions({
      ...filterOptions,
      dateRange: value,
      from,
      to,
    });
  };

  const handleViewModeChanged = (event, value) => {
    setViewMode(value);
    setFilterOptions({
      ...filterOptions,
      viewMode: value,
    });
  };

  return (
    <React.Fragment>
      <Box p={2}>
        <Typography variant="body2">{title}</Typography>
      </Box>
      <Divider />
      <DateFilterDropdown p={2} sx={{ width: "280px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={4}>
                  <Grid item>
                    <Typography variant="body2">Date Range</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl id="date-range-label" size="small" fullWidth>
                      <Select
                        labelId="date-range-label"
                        value={dateRange}
                        onChange={handleDateRangeChanged}
                      >
                        <MenuItem value="yesterday">Yesterday</MenuItem>
                        <MenuItem value="last_week">Last Week</MenuItem>
                        <MenuItem value="last_month">Last Month</MenuItem>
                        <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                        <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                        <MenuItem value="month_to_date">Month to Date</MenuItem>
                        <MenuItem value="year_to_date">Year to Date</MenuItem>
                        <MenuItem value="this_year">This year</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {dateRange === "custom" ? (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size="small"
                          label="From"
                          value={dateFrom}
                          onChange={(value) => {
                            setDateFrom(convertDateToMMDDYY(new Date(value)));
                            setFilterOptions({
                              ...filterOptions,
                              from: convertDateToMMDDYY(new Date(value)),
                            });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size="small"
                          label="To"
                          value={dateTo}
                          onChange={(value) => {
                            setDateTo(convertDateToMMDDYY(new Date(value)));
                            setFilterOptions({
                              ...filterOptions,
                              to: convertDateToMMDDYY(new Date(value)),
                            });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography>Compared to</Typography>
                  </Grid>
                  <Grid item defaultValue="custom" xs={8}>
                    <FormControl id="compared-to-label" size="small" fullWidth>
                      <Select
                        labelId="compared-to-label"
                        defaultValue="previous"
                      >
                        <MenuItem value="previous">Previous period</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {dateRange === "custom" ? (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size="small"
                          label="From"
                          value={compDateFrom}
                          onChange={(value) => {
                            setCompDateFrom(
                              convertDateToMMDDYY(new Date(value))
                            );
                            setFilterOptions({
                              ...filterOptions,
                              compFrom: convertDateToMMDDYY(new Date(value)),
                            });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size="small"
                          label="To"
                          value={compDateTo}
                          onChange={(value) => {
                            setCompDateTo(convertDateToMMDDYY(new Date(value)));
                            setFilterOptions({
                              ...filterOptions,
                              compTo: convertDateToMMDDYY(new Date(value)),
                            });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Typography variant="body1">View By</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={viewMode}
                  onChange={handleViewModeChanged}
                  exclusive
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="day">Day</ToggleButton>
                  <ToggleButton value="week">Week</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DateFilterDropdown>
    </React.Fragment>
  );
};

export default DateFilterMenu;
