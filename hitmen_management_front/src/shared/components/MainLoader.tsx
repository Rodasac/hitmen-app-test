import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const MainLoader: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '95vh',
        flex: 1,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="h3">{title ? title : 'Loading...'}</Typography>
    </Box>
  );
};
