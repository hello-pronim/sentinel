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
import { DatePicker, LocalizationProvider } from "@mui/lab";

const DateFilterDropdownMenu = () => {
  const [viewMode, setViewMode] = useState("day");

  const handleViewModeChanged = (event, value) => {
    setViewMode(value);
  };

  return (
    <Box p={2} sx={{ width: "280px" }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="body2">Date Range</Typography>
                </Grid>
                <Grid item defaultValue="custom">
                  <FormControl id="date-range-label" size="small" fullWidth>
                    <Select labelId="date-range-label" defaultValue="custom">
                      <MenuItem value="custom">Custom select</MenuItem>
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
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
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
                    <Select labelId="compared-to-label" defaultValue="previous">
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
  );
};

export default DateFilterDropdownMenu;
