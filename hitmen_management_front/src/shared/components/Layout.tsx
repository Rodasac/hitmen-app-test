import { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useStore } from '../store';
import { TopBarComponent } from './TopBar';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const LayoutComponent: React.FC = ({ children }) => {
  const token = useStore((state) => state.token);
  const openSnackbar = useStore((state) => state.openSnackbar);
  const msgSnackbar = useStore((state) => state.msgSnackbar);
  const severitySnackbar = useStore((state) => state.severitySnackbar);
  const setSnackbar = useStore((state) => state.setSnackbar);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(false, '', 'info');
  };

  return (
    <>
      {token ? <TopBarComponent /> : null}
      {children}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severitySnackbar}>
          {msgSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};
