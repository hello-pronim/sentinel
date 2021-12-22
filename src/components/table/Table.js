import React from "react";
import styled from "styled-components/macro";

import {
  Paper as MuiPaper,
  Table as MuiTable,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { spacing } from "@mui/system";

import TableHead from "../../components/table/TableHead";
import TableBody from "../../components/table/TableBody";
import TableToolbar from "../../components/table/TableToolbar";

const Paper = styled(MuiPaper)(spacing);

const Table = ({
  title,
  rows,
  columns,
  checkable = false,
  rowsPerPage = 10,
  ...props
}) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("customer");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(rowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  return (
    <div>
      <Paper>
        <TableToolbar title={title} numSelected={selected.length} />
        <TableContainer>
          <MuiTable
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label={`${title} table`}
            {...props}
          >
            <TableHead
              headColumns={columns}
              checkable={checkable}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody
              rows={rows}
              page={page}
              rowsPerPage={perPage}
              order={order}
              orderBy={orderBy}
              checkable={checkable}
              selectedRows={selected}
              handleSelectRow={handleSelectRow}
            />
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={perPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default Table;
