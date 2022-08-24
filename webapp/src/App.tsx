import { FC, ReactNode, useState } from 'react';
import RNShare from './utils/RNShare';
import { Button, Grid, Snackbar, TextField, Typography } from '@mui/material';
import RNStorage from './utils/RNStorage';

const TOKEN_KEY = 'auth-token';

const PluginItemWrapper: FC<{ title?: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Grid sx={{ py: 1 }} container direction='column'>
      {title && <Typography variant='h6'>{title}</Typography>}
      <Grid container direction='row' alignItems='center'>
        {children}
      </Grid>
    </Grid>
  );
};

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [token, setToken] = useState('');
  const [fetchedToken, setFetchedToken] = useState('');


  return (
    <Grid sx={{ p: 3 }} container direction='column'>
      
      <Snackbar
        open={snackbarOpen}
        ContentProps={{
          sx: {
            color: 'white',
            backgroundColor: 'error.main'
          }
        }}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        message={snackbarContent}
      />
      <Grid container direction='column'>
        <Typography variant='h4' align='center'>
          Storage
        </Typography>

        <PluginItemWrapper title='Write'>
          <TextField
            value={token}
            onChange={({ target: { value } }) => setToken(value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <Button
                  onClick={() => RNStorage.write(TOKEN_KEY, token)}
                  variant='text'
                  color='primary'
                >
                  Update
                </Button>
              ),
            }}
          />
        </PluginItemWrapper>

        <PluginItemWrapper title='Read'>
          <Grid item xs>
            {fetchedToken}
          </Grid>
          <Grid item>
            <Button
              onClick={() =>
                RNStorage.read(TOKEN_KEY).then((value) => {
                  setFetchedToken(value);
                })
              }
              variant='text'
              color='primary'
            >
              Fetch
            </Button>
          </Grid>
        </PluginItemWrapper>
      </Grid>

      <Grid container direction='column'>
        <Typography variant='h4' align='center'>
          Share
        </Typography>

        <PluginItemWrapper>
          <Button
            onClick={() => {
              RNShare.share({
                message: 'This is a test',
                url: 'https://reactnative.dev/docs/share',
                title: 'Together Price',
              }).catch((err) => {
                setSnackbarContent(err.message);
                setSnackbarOpen(true);
              });
            }}
            variant='outlined'
            fullWidth
          >
            Share
          </Button>
        </PluginItemWrapper>
      </Grid>
    </Grid>
  );
}

export default App;
