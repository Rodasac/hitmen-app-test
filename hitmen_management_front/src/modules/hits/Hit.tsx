import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useStore } from '../../shared/store';
import { MainLoader } from '../../shared/components/MainLoader';
import { UpdateHitDialog } from './components/UpdateHit';

export const HitView: React.FC = () => {
  const history = useHistory();

  const [openUpdateHit, setOpenUpdateHit] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const hit = useStore((state) => state.hit);
  const isUpdatedHit = useStore((state) => state.isUpdatedHit);
  const getHit = useStore((state) => state.getHit);
  const updateHit = useStore((state) => state.updateHit);

  const { id } = useParams<{ id?: string | undefined }>();

  useEffect(() => {
    if (id === undefined) {
      history.push('/hits');
    }
    if (isUpdatedHit || hit === null) {
      getHit(parseInt(id ?? '0', 10));
    }
  }, [hit, isUpdatedHit, id, getHit, history]);

  const getColor = (state?: string) => {
    switch (state) {
      case 'assigned':
        return 'text.primary';
      case 'failed':
        return 'error.main';
      case 'completed':
        return 'success.main';
      default:
        return 'text.primary';
    }
  };

  if (hit === null) return <MainLoader title="Loading Hit" />;

  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid item xs={8}>
        <Typography gutterBottom variant="h3">
          Hit Details
        </Typography>
      </Grid>
      {currentUser?.isManager ? (
        <Grid item xs={4}>
          <Button
            color="primary"
            fullWidth
            onClick={() => setOpenUpdateHit(true)}
          >
            Update Hit
          </Button>
        </Grid>
      ) : null}
      <Grid item xs={9}>
        <Typography gutterBottom variant="h5" component="span">
          Name of the <em>Hit:</em>
        </Typography>{' '}
        <Typography gutterBottom variant="h6" component="span">
          {hit?.name}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Button
          color="secondary"
          fullWidth
          disabled={hit.workflow !== 'assigned'}
          onClick={() =>
            updateHit(parseInt(id ?? '0', 10), { workflow: 'failed' })
          }
        >
          Cancel Hit
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={hit.workflow !== 'assigned'}
          onClick={() =>
            updateHit(parseInt(id ?? '0', 10), { workflow: 'completed' })
          }
        >
          Complete Hit
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1">
          Description:
        </Typography>{' '}
        {hit?.description}
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1" component="span">
          State:
        </Typography>{' '}
        <Typography
          gutterBottom
          variant="subtitle1"
          component="span"
          sx={{ color: getColor(hit?.workflow) }}
        >
          {hit?.workflow}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1">
          Hitman:
        </Typography>{' '}
        {hit?.hitman.first_name} {hit?.hitman.last_name}
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1">
          Created By:
        </Typography>{' '}
        {hit?.created_by.first_name} {hit?.created_by.last_name}
      </Grid>
      <UpdateHitDialog
        hit={hit}
        isOpen={openUpdateHit}
        onClose={() => setOpenUpdateHit(false)}
      />
    </Grid>
  );
};
