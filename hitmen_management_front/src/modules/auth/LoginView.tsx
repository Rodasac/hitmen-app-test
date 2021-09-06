import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useStore } from '../../shared/store';

type LoginForm = { username: string; password: string };

export const LoginView: React.FC = () => {
  const history = useHistory();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onChange',
  });
  const onSubmit = (data: LoginForm) => {
    console.log(data);
    login(data.username, data.password);
  };

  useEffect(() => {
    if (Boolean(token)) {
      history.push('/hits');
    }
  }, [token, history]);

  return (
    <Grid
      container
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
      }}
    >
      <Grid item xs={10} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ maxHeight: 500 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Login
              </Typography>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    fullWidth
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                    sx={{ m: 1 }}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    sx={{ m: 1 }}
                  />
                )}
              />
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="secondary"
                component={RouterLink}
                to="/register"
              >
                Go to Register
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                type="submit"
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};
