import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridValueGetterParams,
  MuiEvent,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import MuiPagination from "@mui/material/Pagination";

interface TablePaginationProps {
  page: number;
  onPageChange: (event: React.MouseEvent | null, page: number) => void;
}
function Pagination({ page, onPageChange }: TablePaginationProps) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  return (
    <MuiPagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rows: Object[];
  prevFunction: () => void;
  nextFunction: () => void;
}
/**
 * A Table component
 */
const Table = ({ columns, rows, prevFunction, nextFunction }: TableProps) => {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      sx={{ border: 0 }}
      disableRowSelectionOnClick
      pagination
      slots={{
        pagination: CustomPagination,
      }}
      {...rows}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 100,
          },
        },
      }}
      pageSizeOptions={[]}
      disableColumnMenu

      // getRowId={(r) => r.DT_RowId}
      // onCellClick={{console.log(getRowId)}}
    />
  );
};

export default Table;
