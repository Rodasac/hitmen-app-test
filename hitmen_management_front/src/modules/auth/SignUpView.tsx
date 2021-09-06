import { useEffect, useRef } from 'react';
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

import { UserSignUpInput, useStore } from '../../shared/store';

export const SignUpView: React.FC = () => {
  const history = useHistory();
  const token = useStore((state) => state.token);
  const isSignUpSuccess = useStore((state) => state.isSignUpSuccess);
  const signup = useStore((state) => state.signup);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserSignUpInput>({
    mode: 'onChange',
  });

  const onSubmit = (data: UserSignUpInput) => {
    console.log(data);
    signup(data);
  };

  const password = useRef('');
  password.current = watch('password', '');

  useEffect(() => {
    if (isSignUpSuccess) {
      history.push('/');
    }
  }, [isSignUpSuccess, history]);

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
          <Card sx={{ maxHeight: 600 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Register
              </Typography>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: true }}
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
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    sx={{ m: 1 }}
                  />
                )}
              />
              <Controller
                name="first_name"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={Boolean(errors.first_name)}
                    helperText={errors.first_name}
                    sx={{ m: 1 }}
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={Boolean(errors.last_name)}
                    helperText={errors.last_name}
                    sx={{ m: 1 }}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: true, minLength: 8 }}
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
              <Controller
                name="password2"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 8,
                  validate: (value) => value === password.current,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Repeat Password"
                    type="password"
                    fullWidth
                    error={Boolean(errors.password2)}
                    helperText={errors.password2}
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
                to="/"
              >
                Go to Login
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                type="submit"
              >
                Register
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};
