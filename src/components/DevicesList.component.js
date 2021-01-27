import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector, useDispatch } from 'react-redux';
import { selectDevice } from '../actions/DevicesList.action';
import OnlineCircleIcon from '@material-ui/icons/FiberManualRecord';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';
import { ReactComponent as ModbusDeviceIcon } from '../assets/PacIcon.svg';
import { ReactComponent as S7DeviceIcon } from '../assets/S7Icon.svg';
import { ReactComponent as InternalDeviceIcon } from '../assets/InternalDeviceIcon.svg';
import { ReactComponent as MBGatewayDeviceIcon } from '../assets/MBGatewayIcon.svg';
import { ReactComponent as MSAgentDeviceIcon } from '../assets/MSAgentIcon.svg';
import { ReactComponent as MQTTDeviceIcon } from '../assets/MQTTIcon.svg';
import { sortByDeviceType } from '../utilities/sortObject.utility';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  active: {
    color: '#2fcc2f',
    height: '15px',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  inactive: {
    color: 'red',
    height: '15px',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  iconMarginHorizontal: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '40px'
  },
  listItem: {
    maxHeight: '60px',
  },
  list: {
    paddingTop: '0px',
    paddingBottom: '0px'
  }
}));

export default function SimpleList() {
  const classes = useStyles();
  const selectedDevice = useSelector(state => state.DevicesListReducer);
  const allDevices = useSelector(state => state.DevicesSelectionPageReducer.devices)
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedDevice.selectedDeviceID === '' && Object.keys(allDevices).length > 0) {
      const firstEntry = Object.entries(allDevices)[0]
      dispatch(selectDevice(firstEntry[1].id, firstEntry[1].type))
    }
  }, [dispatch, allDevices, selectedDevice])

  const deviceTypeIcon = (type) => {
    switch (type) {
      case 'MBDevice':
        return <ModbusDeviceIcon className={classes.iconMarginHorizontal} />
      case 'S7Device':
        return <S7DeviceIcon className={classes.iconMarginHorizontal} />
      case 'InternalDevice':
        return <InternalDeviceIcon className={classes.iconMarginHorizontal} />
      case 'MBGatewayDevice':
        return <MBGatewayDeviceIcon className={classes.iconMarginHorizontal} />
      case 'MSAgentDevice':
        return <MSAgentDeviceIcon className={classes.iconMarginHorizontal} />
      case 'MSMQTTAgentDevice':
        return <MQTTDeviceIcon className={classes.iconMarginHorizontal} />
      default:
        return <DeviceUnknownIcon className={classes.iconMarginHorizontal} />
    }
  }

  const devicesToDisplay = sortByDeviceType(allDevices)
  const createDevicesLists = () => {
    return Object.values(devicesToDisplay).map((deviceGroup, index) => {
      return (
        Object.values(deviceGroup).length > 0 ?
          <React.Fragment key={index}>
            <List component="nav" aria-label="device-list" className={classes.list}>
              {Object.values(deviceGroup).map((device, index) => {
                const isActive = device.isConnected !== undefined ? device.isConnected && device.isActive : device.isActive;
                return (
                  <ListItem
                    className={classes.listItem}
                    key={index}
                    button
                    selected={selectedDevice.selectedDeviceID === device.id ? true : false}
                    onClick={() => dispatch(selectDevice(device.id, device.type))}>
                    <ListItemIcon>
                      <OnlineCircleIcon className={isActive ? classes.active : classes.inactive} />
                      {deviceTypeIcon(device.type)}
                    </ListItemIcon>
                    <ListItemText primary={device.name} />
                  </ListItem>
                )
              })}
            </List>
            <Divider />
          </React.Fragment>
          : null
      )
    })
  }

  return (
    <React.Fragment>
      {createDevicesLists()}
    </React.Fragment>
  );
}
