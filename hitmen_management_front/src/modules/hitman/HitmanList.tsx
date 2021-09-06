import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useStore } from '../../shared/store';
import { MainLoader } from '../../shared/components/MainLoader';

export const HitmanListView: React.FC = () => {
  const users = useStore((state) => state.users);
  const isUpdatedUserList = useStore((state) => state.isUpdatedUserList);
  const getUsers = useStore((state) => state.getUsers);

  useEffect(() => {
    if (isUpdatedUserList) {
      getUsers();
    }
  }, [users, isUpdatedUserList, getUsers]);

  if (users.length === 0 || isUpdatedUserList)
    return <MainLoader title="Loading Users List" />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3">Users List</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  key={row.pk}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link component={RouterLink} to={`/hitman/${row.pk}`}>
                      {row.first_name} {row.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.hitmanprofile?.workflow}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
