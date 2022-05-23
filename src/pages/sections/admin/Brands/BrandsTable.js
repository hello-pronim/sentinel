import React from "react";
import styled from "styled-components/macro";
import MaterialTable from "@material-table/core";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { spacing } from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

const BrandsTable = ({ title, data, loading }) => {
  const columns = [
    {
      field: "id",
      title: "#",
      width: "10%",
    },
    {
      field: "name",
      title: "Brand",
      width: "50%",
    },
    {
      field: "category",
      title: "Category",
      width: "30%",
    },
    {
      title: "Actions",
      width: "10%",
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
        <CardHeader
          title={title}
          action={
            <Button variant="outlined" color="primary" startIcon={<AddIcon />}>
              New
            </Button>
          }
        />
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
