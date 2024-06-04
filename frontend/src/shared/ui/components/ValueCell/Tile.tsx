import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

interface IValueCellProps {
  name?: string,
  value?: string | number;
}

export function ValueCell({ name, value }: IValueCellProps) {
  return (
    <TableContainer component={({ children }) => <Paper elevation={3}>{children}</Paper>}>
        <Table size="small">
            <TableBody>
                <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                      {name}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                  </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
  )
}
