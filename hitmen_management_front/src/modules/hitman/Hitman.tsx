import { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { useStore } from '../../shared/store';
import { MainLoader } from '../../shared/components/MainLoader';
import IconButton from '@mui/material/IconButton';
import { AddHitmanToManager } from './components/AddHitmanToManager';

export const HitmanView: React.FC = () => {
  const history = useHistory();

  const currentUser = useStore((state) => state.currentUser);
  const user = useStore((state) => state.user);
  const managedUsers = useStore((state) => state.managedUsers);
  const getUser = useStore((state) => state.getUser);
  const getManagedUsers = useStore((state) => state.getManagedUsers);
  const updateUser = useStore((state) => state.updateUser);
  const disableUser = useStore((state) => state.disableUser);

  const [open, setOpen] = useState(false);

  const { id } = useParams<{ id?: string | undefined }>();

  const paramID = useMemo(() => parseInt(id ?? '0', 10), [id]);

  useEffect(() => {
    if (id === undefined) {
      history.push('/hits');
    }
    getUser(paramID);
  }, [id, getUser, history, paramID]);

  useEffect(() => {
    if (currentUser?.user_id === 1) {
      getManagedUsers(paramID);
    }
  }, [currentUser?.user_id, getManagedUsers, id, paramID]);

  const getColor = (state?: string) => {
    switch (state) {
      case 'active':
        return 'success.main';
      case 'inactive':
        return 'error.main';
      default:
        return 'success.main';
    }
  };

  if (user === null) return <MainLoader title="Loading User" />;

  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h3">
          Hitman Profile
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography gutterBottom variant="h5" component="span">
          Name of the <em>Hitman:</em>
        </Typography>{' '}
        <Typography gutterBottom variant="h6" component="span">
          {user?.first_name} {user?.last_name}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Button
          color="secondary"
          fullWidth
          disabled={user.hitmanprofile?.workflow !== 'assigned'}
          onClick={() => disableUser(parseInt(id ?? '0', 10))}
        >
          Fire Hitman
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1">
          Email:
        </Typography>{' '}
        {user?.email}
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1" component="span">
          State:
        </Typography>{' '}
        <Typography
          gutterBottom
          variant="subtitle1"
          component="span"
          sx={{ color: getColor(user?.hitmanprofile?.workflow) }}
        >
          {user?.hitmanprofile?.workflow}
        </Typography>
      </Grid>
      {currentUser?.user_id === 1 ? (
        <Grid item xs={12}>
          <Button fullWidth onClick={() => setOpen(true)}>
            Update managees list
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {managedUsers.map((row) => (
                  <TableRow
                    key={row.pk}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.first_name} {row.last_name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.hitmanprofile?.workflow}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          updateUser(parseInt(id ?? '0', 10), {
                            hitmanprofile: {
                              manages: managedUsers
                                .filter((managed) => managed.pk !== row.pk)
                                .map((managed) => managed.pk),
                            },
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <AddHitmanToManager
            id={paramID}
            managed={user.hitmanprofile?.manages ?? []}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};
