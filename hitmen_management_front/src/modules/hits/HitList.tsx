import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
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
import { CreateHitDialog } from './components/CreateHit';

export const HitListView: React.FC = () => {
  const [openCreateHit, setOpenCreateHit] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const hits = useStore((state) => state.hits);
  const isUpdatedHitList = useStore((state) => state.isUpdatedHitList);
  const getHits = useStore((state) => state.getHits);

  useEffect(() => {
    if (isUpdatedHitList) {
      getHits();
    }
  }, [hits, isUpdatedHitList, getHits]);

  if (isUpdatedHitList) return <MainLoader title="Loading Hit List" />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Typography variant="h3">Hits List</Typography>
      </Grid>
      {currentUser?.isManager ? (
        <Grid item xs={4}>
          <Button
            color="primary"
            fullWidth
            onClick={() => setOpenCreateHit(true)}
          >
            Create Hit
          </Button>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name (Hit)</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Hitman</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hits.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link component={RouterLink} to={`/hit/${row.pk}`}>
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.workflow}</TableCell>
                  <TableCell>
                    {row.hitman.first_name} {row.hitman.last_name}
                  </TableCell>
                  <TableCell>
                    {row.created_by.first_name} {row.created_by.last_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <CreateHitDialog
        isOpen={openCreateHit}
        onClose={() => setOpenCreateHit(false)}
      />
    </Grid>
  );
};
