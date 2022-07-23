import React from 'react';
import { AlertColor, Snackbar, Alert } from '@mui/material';

const ActionToaster = ({
  showToaster = false,
  setShowToaster,
  message = 'Action performed successfully!',
  alertColor = 'success',
}:
{ showToaster: boolean;
  setShowToaster: (showToaster:boolean) => void;
  message?:string;
  alertColor?: AlertColor;
}) => {
  const onCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToaster(false);
  };
  return (
    <Snackbar
      open={showToaster}
      autoHideDuration={3000}
      onClose={onCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onCloseSnackbar} severity={alertColor} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ActionToaster;
