import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Divider } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";

import { convertDateToMMDDYY, getPastDate } from "../../../../utils/functions";

const DateFilterMenu = ({ title, filterOptions, setFilterOptions }) => {
  const [dateRange, setDateRange] = useState(filterOptions.dateRange);
  const [viewMode, setViewMode] = useState(filterOptions.viewMode);
  const [dateFrom, setDateFrom] = useState(convertDateToMMDDYY(new Date()));
  const [dateTo, setDateTo] = useState(convertDateToMMDDYY(new Date()));

  const handleDateRangeChanged = (event) => {
    const { value } = event.target;

    const today = new Date();
    let from = convertDateToMMDDYY(today);
    let to = convertDateToMMDDYY(today);
    if (value === "yesterday") {
      from = convertDateToMMDDYY(getPastDate(today, 1));
      to = convertDateToMMDDYY(getPastDate(today, 1));
    } else if (value === "last_week") {
    } else if (value === "last_month") {
    } else if (value === "last_7_days") {
      from = convertDateToMMDDYY(getPastDate(today, 6));
    } else if (value === "last_30_days") {
      from = convertDateToMMDDYY(getPastDate(today, 29));
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
      <Box p={2} sx={{ width: "280px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography variant="body2">Date Range</Typography>
                  </Grid>
                  <Grid item>
                    <FormControl id="date-range-label" size="small" fullWidth>
                      <Select
                        labelId="date-range-label"
                        value={dateRange}
                        onChange={handleDateRangeChanged}
                      >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="yesterday">Yesterday</MenuItem>
                        <MenuItem value="last_week">Last Week</MenuItem>
                        <MenuItem value="last_month">Last Month</MenuItem>
                        <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                        <MenuItem value="last_30_days">Last 30 Days</MenuItem>
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
                          defaultValue="11-01-2021"
                          value={dateFrom}
                          onChange={(value) => {
                            setDateFrom(convertDateToMMDDYY(new Date(value)));
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
                          defaultValue="11-13-2021"
                          value={dateTo}
                          onChange={(value) => {
                            setDateTo(convertDateToMMDDYY(new Date(value)));
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
                    <FormControlLabel
                      style={{ marginRight: 0 }}
                      control={<Checkbox defaultChecked />}
                      label="Compared to: "
                    />
                  </Grid>
                  <Grid item defaultValue="custom">
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
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        size="small"
                        label="From"
                        value="11-01-2021"
                        onChange={() => {}}
                        renderInput={(params) => <TextField {...params} />}
                        disabled
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        size="small"
                        label="To"
                        value="11-13-2021"
                        onChange={() => {}}
                        renderInput={(params) => <TextField {...params} />}
                        disabled
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
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
                >
                  <ToggleButton value="day">Day</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                  <ToggleButton value="year">Year</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default DateFilterMenu;
