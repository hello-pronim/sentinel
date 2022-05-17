import React from "react";
import styled from "styled-components/macro";
import MaterialTable from "@material-table/core";

import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { spacing } from "@mui/system";

import { convertPercentFormat } from "../../../../utils/functions";

const Divider = styled(MuiDivider)(spacing);

const BrandsTable = ({ title, data, loading }) => {
  const columns = [
    {
      field: "name",
      title: "Brand",
    },
    {
      field: "category",
      title: "Category",
    },
    {
      field: "MAP",
      title: "MAP",
      customSort: (a, b) => a.revenue - b.revenue,
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { MAP } = rowData;

        return `${convertPercentFormat(MAP)}`;
      },
    },
    {
      title: "Actions",
      render: (rowData) => {
        return (
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardHeader title={title} />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {data !== null && !loading ? (
                <MaterialTable
                  columns={columns}
                  data={data}
                  options={{
                    pageSize: 10,
                    search: true,
                    showTitle: false,
                    emptyRowsWhenPaging: false,
                  }}
                />
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
    </React.Fragment>
  );
};

export default BrandsTable;
