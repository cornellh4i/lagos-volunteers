import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rowData: Object[];
  /** The function called to obtain the previous elements */
  prevFunction: () => Promise<any[]>;
  /** The function called to obtain the next elements */
  nextFunction: () => Promise<any[]>;
}
/**
 * A Table component
 */
const Table = ({
  columns,
  rowData,
  prevFunction,
  nextFunction,
}: TableProps) => {
  const [rows, setRows] = React.useState<any[]>(rowData);
  // Using the cursor mdo
  const PAGE_SIZE = 5;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const handlePaginationModelChange = async (
    newPaginationModel: GridPaginationModel
  ) => {
    var result = rows;
    if (paginationModel.page < newPaginationModel.page) {
      // means going to next
      console.log("going forwards");
      result = await nextFunction();
    } else {
      //means going to previous
      console.log("going pervious");
      result = await prevFunction();
    }
    setRows(result);
    setPaginationModel(newPaginationModel);
  };

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      sx={{ border: 0 }}
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: PAGE_SIZE,
          },
        },
      }}
      onPaginationModelChange={handlePaginationModelChange}
      pageSizeOptions={[]}
      disableColumnMenu

      // getRowId={(r) => r.DT_RowId}
      // onCellClick={{console.log(getRowId)}}
    />
  );
};

export default Table;
