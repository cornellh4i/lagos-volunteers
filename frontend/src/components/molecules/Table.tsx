import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rowData: Object[];
  /** The length of the entire dataset if paginated */
  dataSetLength: number;
  /** Initial ID */
  initialID: string;
  /** The cursor that will progress through each page */
  progressCursor: string;
  /** The function called to obtain the next elements */
  nextFunction: (cursor: string) => Promise<
    | {
        result: any[];
        last_user_id: string; // Adjust the type as needed
      }
    | undefined
  >;
}
/**
 * A Table component
 */
// initialCursor
const Table = ({
  columns,
  rowData,
  dataSetLength,
  initialID,
  progressCursor,
  nextFunction,
}: TableProps) => {
  const PAGE_SIZE = 5;
  const [rows, setRows] = React.useState<any[]>(rowData);
  // Using the cursor mdo
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const [cursor, setCursor] = React.useState<any[]>([initialID]);
  const [rowCountState, setRowCountState] = React.useState(dataSetLength);
  const [currentCursor, setCurrentCursor] =
    React.useState<string>(progressCursor);

  const handlePaginationModelChange = async (
    newPaginationModel: GridPaginationModel
  ) => {
    // stores the result from pagination request
    var userData = [];
    // tracks which page we on ["","userid1","userid2"...] --> [page1,page2,page3...]
    var cursorArray = cursor;
    // stores which id we are using to call the pagination request.
    var current_cursor_id: string = "";

    if (paginationModel.page < newPaginationModel.page) {
      // means going to next
      console.log("going forwards");
      // get the last_user_id from rows and add to cursor list
      const output = await nextFunction(currentCursor);
      if (output !== undefined) {
        cursorArray.push(currentCursor);
        current_cursor_id = output.last_user_id;
        userData = output.result;
      }
    } else {
      //means going to previous
      console.log("going previous");
      // another pop to get the current user_id. It must be followed by a push.
      cursorArray.pop();
      // second pop
      var t = cursorArray.pop();
      cursorArray.push(t);
      const output = await nextFunction(t);
      if (output !== undefined) {
        current_cursor_id = output.last_user_id;
        userData = output.result;
      }
    }
    setRows(userData);
    setCursor(cursorArray);
    setCurrentCursor(current_cursor_id);
    setPaginationModel(newPaginationModel);
  };

  return (
    <div>
      {rows.length > 0 && (
        <DataGrid
          columns={columns}
          rows={rows}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          rowCount={rowCountState}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[]}
          paginationMode="server"
          disableColumnMenu
        />
      )}
    </div>
  );
};

export default Table;
