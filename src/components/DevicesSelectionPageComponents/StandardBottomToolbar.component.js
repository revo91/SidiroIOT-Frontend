import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ActivateService from '../../services/activate.service';
import { refreshDeviceParams } from '../../actions/DevicesSelectionPage.action';

const useStyles = makeStyles((theme) => ({
  onboarded: {
    color: 'green'
  },
  offboarded: {
    color: 'red'
  },
  active: {
    color: '#2fcc2f'
  }
}));

export default function StandardBottomToolbar() {
  const { t } = useTranslation();
  const classes = useStyles();
  const selectedDevice = useSelector(state => state.DevicesListReducer);
  const allDevices = useSelector(state => state.DevicesSelectionPageReducer.devices);
  const dispatch = useDispatch();

  const activateDevice = (activate, device) => {
    ActivateService.activateDevice(activate, device).then(res => {
      if (res.status === 200) {
        dispatch(refreshDeviceParams(res.data))
      }
    })
  }

  const isActive = () => {
    if (selectedDevice.selectedDeviceID !== '' && allDevices[selectedDevice.selectedDeviceID] !== undefined) {
      return allDevices[selectedDevice.selectedDeviceID].isActive
    }
    else {
      return null
    }
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {isActive() ? <span className={classes.active}>{t('DevicesSelectionPage.StatusConnected')}</span> : <span className={classes.offboarded}>{t('DevicesSelectionPage.StatusDisconnected')}</span>}</Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Button disabled={isActive()} fullWidth variant="contained" color="primary" onClick={() => activateDevice(true, selectedDevice.selectedDeviceID)}>{t('DevicesSelectionPage.Connect')}</Button>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Button disabled={!isActive()} fullWidth variant="contained" color="secondary" onClick={() => activateDevice(false, selectedDevice.selectedDeviceID)}>{t('DevicesSelectionPage.Disconnect')}</Button>
      </Grid>
    </React.Fragment>
  )
}