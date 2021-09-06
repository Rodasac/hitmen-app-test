import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { Hit, HitUpdateInput, useStore } from '../../../shared/store';

export const UpdateHitDialog: React.FC<{
  hit: Hit;
  isOpen: boolean;
  onClose: () => void;
}> = ({ hit, isOpen, onClose }) => {
  const users = useStore((state) => state.users);
  const getUsers = useStore((state) => state.getUsers);
  const updateHit = useStore((state) => state.updateHit);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HitUpdateInput>({
    mode: 'onChange',
    defaultValues: {
      workflow: 'assigned',
    },
  });

  const onSubmit = (data: HitUpdateInput) => {
    console.log(data);
    updateHit(hit.pk, data);
    onClose();
  };

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [users, getUsers]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add new hit</DialogTitle>
        <Controller
          name="name"
          control={control}
          defaultValue={hit.name}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name of the hit"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue={hit.description}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          )}
        />
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Add hit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
