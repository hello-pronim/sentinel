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
} from "@mui/material";
import { spacing } from "@mui/system";

import { convertPercentFormat } from "../../../../utils/functions";

const Divider = styled(MuiDivider)(spacing);

const BrandsMAPTable = ({ title, data, loading }) => {
  const columns = [
    {
      field: "name",
      title: "Brand",
      width: "55%",
    },
    {
      field: "MAP",
      title: "MAP",
      customSort: (a, b) => a.revenue - b.revenue,
      width: "15%",
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
      field: "comparisonMAP",
      title: "Comparison MAP",
      customSort: (a, b) => a.comparisonRevenue - b.comparisonRevenue,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { comparisonMAP } = rowData;

        return `${convertPercentFormat(comparisonMAP)}`;
      },
    },
    {
      field: "mapChange",
      title: "MAP Change",
      customSort: (a, b) => a.mapChange - b.mapChange,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { mapChange } = rowData;

        return (
          <Chip
            label={`${convertPercentFormat(mapChange)}`}
            color={
              mapChange > 0 ? "success" : mapChange === 0 ? "warning" : "error"
            }
          />
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

export default BrandsMAPTable;
