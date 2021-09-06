import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useStore } from '../../../shared/store';

export const AddHitmanToManager: React.FC<{
  id: number;
  managed: number[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ id, managed, isOpen, onClose }) => {
  const [managedUsers, setManagedUsers] = useState(managed);
  const users = useStore((state) => state.users);
  const getUsers = useStore((state) => state.getUsers);
  const updateUser = useStore((state) => state.updateUser);

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [users, getUsers]);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;
    setManagedUsers(
      typeof value === 'string'
        ? value.split(',').map((item) => parseInt(item))
        : (value as number[])
    );
  };

  const updateManaged = () => {
    updateUser(id, { hitmanprofile: { manages: managedUsers } });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add hitman to manager</DialogTitle>
      <DialogContent sx={{ p: 2, m: 1 }}>
        <TextField
          autoFocus
          select
          label="Managed Users"
          fullWidth
          SelectProps={{
            multiple: true,
            value: managedUsers,
            onChange: handleChange,
          }}
        >
          {users.map((user) => (
            <MenuItem value={user.pk} key={user.pk}>
              {user.first_name} {user.last_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={updateManaged}>Add user</Button>
      </DialogActions>
    </Dialog>
  );
};
