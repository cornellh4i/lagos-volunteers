import React from "react";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridValueGetterParams,
  MuiEvent,
} from "@mui/x-data-grid";

type TableProps = {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rows: Object[];
};

/**
 * A Table component
 */
const Table = ({ columns, rows }: TableProps) => {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      sx={{ border: 0 }}
      disableRowSelectionOnClick
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
