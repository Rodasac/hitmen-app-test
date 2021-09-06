import { Link as RouterLink, useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useStore } from '../store';

export const TopBarComponent: React.FC = () => {
  const history = useHistory();
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hitman App
            </Typography>
            <Button component={RouterLink} to="/hits" color="inherit">
              Hits
            </Button>
            <Button component={RouterLink} to="/hitmen" color="inherit">
              Users
            </Button>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="profile"
              sx={{ ml: 2 }}
              onClick={() => history.push(`/hitman/${currentUser?.user_id}`)}
            >
              <PersonIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logout"
              sx={{ ml: 2 }}
              onClick={() => logout()}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Box height={20} />
    </>
  );
};
