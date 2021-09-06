import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { HitCreateInput, useStore } from '../../../shared/store';

export const CreateHitDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const users = useStore((state) => state.users);
  const getUsers = useStore((state) => state.getUsers);
  const createHit = useStore((state) => state.createHit);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HitCreateInput>({
    mode: 'onChange',
    defaultValues: {
      workflow: 'assigned',
    },
  });

  const onSubmit = (data: HitCreateInput) => {
    console.log(data);
    createHit(data);
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
        <DialogContent>
          <DialogTitle>Add new hit</DialogTitle>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name of the hit"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                sx={{ m: 1 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                error={Boolean(errors.description)}
                helperText={errors.description}
                sx={{ m: 1 }}
              />
            )}
          />
          <Controller
            name="hitman"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Hitman"
                fullWidth
                error={Boolean(errors.hitman)}
                helperText={errors.hitman}
                sx={{ m: 1 }}
              >
                {users.map((user) => (
                  <MenuItem value={user.pk} key={user.pk}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>
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
