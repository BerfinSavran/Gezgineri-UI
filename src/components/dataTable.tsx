import { useEffect, useState } from "react";
import { Button as MuiButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface DataTableProps {
  items: any[];
  tableClassName?: string;
  onApprove?: (item: any) => void;
  onDeny?: (item: any) => void;
  isApprovable?: (item: any) => boolean;
  isDeniable?: (item: any) => boolean;
  hiddenColumns?: string[];
  renderColumn?: (column: string, value: any) => JSX.Element | string;
  dataTarget?: string;
  columnNames?: { [key: string]: string };
  hideActions?: string;
  customElementOfActions?: (item: any) => JSX.Element;
  customColumn?: (item: any) => JSX.Element;
  isCustomColumnExist?: string;
}

function DataTable({
  items,
  onApprove,
  onDeny,
  isApprovable,
  isDeniable,
  hiddenColumns = [],
  renderColumn,
  columnNames = {},
  hideActions = "false",
  customElementOfActions,
  customColumn,
  isCustomColumnExist = "false"
}: DataTableProps) {
  const [records, setRecords] = useState<any>([]);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    const firstItem = items.length > 0 ? items[0] : {};
    const newColumns = Object.keys(firstItem).filter(
      (column) => !hiddenColumns.includes(column)
    );
    setColumns([...newColumns]);

    if (hideActions === "false" && isCustomColumnExist === "false") {
      setColumns([...newColumns, "Actions"]);
    } else if (hideActions === "false" && isCustomColumnExist === "true") {
      setColumns([
        ...newColumns,
        ...(customColumn && columnNames["customColumnName"] ? [columnNames["customColumnName"]] : []),
        "Actions"
      ]);
    } else if (hideActions === "true" && isCustomColumnExist === "true") {
      setColumns([
        ...newColumns,
        ...(customColumn && columnNames["customColumnName"] ? [columnNames["customColumnName"]] : [])
      ]);
    } else {
      setColumns([...newColumns]);
    }

    const newRecords = items.map((record: any, index: any) => (
      <TableRow key={index}>
        {newColumns.map((column) => (
          <TableCell key={column} align="center">
            {renderColumn ? renderColumn(column, record[column]) : record[column]}
          </TableCell>
        ))}
        {customColumn && <TableCell>{customColumn(record)}</TableCell>}
        {hideActions === "false" && (
          <TableCell align="center">
            {onApprove && (isApprovable ? isApprovable(record) : true) && record.status !== 1 && (
              <MuiButton
                sx={{ mr: 2 }}
                variant="contained"
                color="success"
                onClick={() => onApprove(record)}
              >
                Onayla
              </MuiButton>
            )}
            {onDeny && (isDeniable ? isDeniable(record) : true) && record.status !== 2 && (
              <MuiButton
                variant="contained"
                color="error"
                onClick={() => onDeny(record)}
              >
                Reddet
              </MuiButton>
            )}
            {customElementOfActions && customElementOfActions(record)}
          </TableCell>
        )}

      </TableRow>
    ));

    setRecords(newRecords.length > 0 ? newRecords : []);
  }, [items, onApprove, onDeny, isApprovable, isDeniable, hiddenColumns, renderColumn, hideActions, customColumn]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(
              (column) =>
                !hiddenColumns.includes(column) && (
                  <TableCell
                    key={column}
                    align="center"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {columnNames[column] || column}
                  </TableCell>
                )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length > 0 ? (
            records
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No Records Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

export default DataTable;
