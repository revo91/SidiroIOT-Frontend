import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageIcon from "@material-ui/icons/Language";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DrawerRoutes from '../routes/DrawerRoutes.routes';
import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory, faThermometerHalf, faHdd } from '@fortawesome/free-solid-svg-icons'
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import LoginPage from './LoginPage.component';
import { setHardwareUsage } from '../actions/HardwareUsage.action';
import worker from 'workerize-loader!../workers/hwinfo.worker'; //eslint-disable-line import/no-webpack-loader-syntax
import PrivateRoute from '../routes/ProtectedUser.routes';
import AuthService from "../services/auth.service";
import { setAuthenticated } from '../actions/Authentication.action';
import { isAdmin } from '../services/isAuthenticated.service';
import CircularProgressWithLabel from './CircularProgress.component';
import { setLoginFormUsername, setLoginFormPassword } from '../actions/LoginPage.action';
import SiemensLogoPetrol from '../assets/sie-logo-petrol-rgb.svg';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EventNoteIcon from '@material-ui/icons/EventNote';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      display: 'none'
    },
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      display: 'flex'
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width: `calc(100% - 57px)`,
    padding: theme.spacing(3),
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      paddingBottom: theme.spacing(10),
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
  },
  bottomNavi: {
    position: 'fixed',
    marginTop: '50px',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      display: 'flex'
    },
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      display: 'none'
    },
    [`${theme.breakpoints.up('md')}`]: {
      display: 'none'
    },
    textAlign: 'center',
  },
  title: {
    flexGrow: 1,
  },
  hardwareUsage: {
    width: '50px',
    height: '40px',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center'
    },
    //height: '40px',
    flexGrow: 1
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  loginButton: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    }
  },
  siemensLogo: {
    paddingRight: '15px',
    maxHeight: '19px'
  },
}));

let instance;

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const matches = useMediaQuery(`${theme.breakpoints.down('sm')} and (orientation: portrait)`)
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [bottomNaviValue, setBottomNaviValue] = useState(0);
  const hardwareUsage = useSelector(state => state.HardwareUsageReducer);
  const authenticated = useSelector(state => state.AuthenticationReducer.authed);
  const dispatch = useDispatch();
  let history = useHistory();
  let location = useLocation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const setHardwareStats = (message) => {
      const { data } = message;
      if (data.cpuUsage !== undefined) {
        dispatch(setHardwareUsage(message.data.cpuUsage, message.data.cpuTemperature, message.data.ramUsage, message.data.diskUsage))
      }
    }
    if (instance === undefined) {
      instance = worker()
    }
    instance.addEventListener("message", message => setHardwareStats(message))
    return () => {
      instance.postMessage({ token: null, text: 'stop' })
      instance.removeEventListener("message", message => setHardwareStats(message))
      instance.terminate()
    }
  }, [dispatch]);

  useEffect(() => {
    setBottomNaviValue(location.pathname)
  }, [location]);

  useEffect(() => {
    if (authenticated === false) {
      instance.postMessage({ token: null, text: 'stop' })
    }
    else {
      instance.postMessage({ token: JSON.parse(localStorage.getItem("user")).accessToken, text: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  const signout = () => {
    dispatch(setAuthenticated(false))
    AuthService.logout()
    handleMenuClose()
    dispatch(setLoginFormUsername(""))
    dispatch(setLoginFormPassword(""))
    history.push('/login')
  }

  useEffect(() => {
    if (matches) {
      //small viewport
      setOpen(false)
      setAnchorEl(null)
    }
  }, [matches])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link}
        to="/myaccount"
        onClick={handleMenuClose}>{t('AccountMenu.MyAccount')}</MenuItem>
      <MenuItem onClick={() => signout()}>{t('AccountMenu.Logout')}</MenuItem>
      {isAdmin() ?
        <div>
          <Divider />
          <MenuItem component={Link}
            onClick={handleMenuClose}
            to="/useraccounts">{t('AccountMenu.UserAccounts')}</MenuItem>
        </div>
        : null
      }
    </Menu >
  );

  const toFixed = (num) => {
    if (num !== null) {
      return num.toFixed()
    }
    else {
      return null
    }
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Badge badgeContent={`${toFixed(hardwareUsage.cpuUsage)}%`} color="primary" >
          <IconButton aria-label="cpu usage" color="inherit" className={classes.hardwareUsage} >
            <FontAwesomeIcon icon={faMicrochip} />
          </IconButton>
        </Badge>
        <p>CPU</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={`${toFixed(hardwareUsage.cpuTemperature)}°C`} color="primary">
          <IconButton aria-label="cpu temperature" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faThermometerHalf} />
          </IconButton>
        </Badge>
        <p>TEMP</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={`${toFixed(hardwareUsage.ramUsage)}%`} color="primary" >
          <IconButton aria-label="memory usage" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faMemory} />
          </IconButton>
        </Badge>
        <p>MEM</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={`${toFixed(hardwareUsage.diskUsage)}%`} color="primary">
          <IconButton aria-label="space usage" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faHdd} />
          </IconButton>
        </Badge>
        <p>DISK</p>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{t('AccountMenu.Profile')}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Switch>
        <Route path="/login" render={() => <LoginPage />} />
        <PrivateRoute path="/">
          <React.Fragment>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                    [classes.hide]: matches
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap className={classes.title}>
                  SidiroIOT
                </Typography>

                <div className={classes.sectionDesktop}>
                  <Typography variant="body1">CPU</Typography>
                  <CircularProgressWithLabel value={hardwareUsage.cpuUsage} unit="%" />
                  <Typography variant="body1">TEMP</Typography>
                  <CircularProgressWithLabel value={hardwareUsage.cpuTemperature} unit="°C" />
                  <Typography variant="body1">MEM</Typography>
                  <CircularProgressWithLabel value={hardwareUsage.ramUsage} unit="%" />
                  <Typography variant="body1">DISK</Typography>
                  <CircularProgressWithLabel value={hardwareUsage.diskUsage} unit="%" />
                </div>
                <IconButton
                  className={classes.loginButton}
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
            >
              <div className={classes.toolbar}>
                <img src={SiemensLogoPetrol} alt="Siemens Logo" className={classes.siemensLogo} />
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem button component={Link} to="/" selected={location.pathname === "/" ? true : false} >
                  <ListItemIcon>
                    <AccountTreeIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Drawer.Devices')} />
                </ListItem>
                {isAdmin() ?
                  <React.Fragment>
                    <ListItem button component={Link} to="/settings" selected={location.pathname === "/settings" ? true : false} >
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary={t('Drawer.Settings')} />
                    </ListItem>
                    <ListItem button component={Link} to="/logs" selected={location.pathname === "/logs" ? true : false} >
                      <ListItemIcon>
                        <EventNoteIcon />
                      </ListItemIcon>
                      <ListItemText primary={t('Drawer.Logs')} />
                    </ListItem>
                  </React.Fragment>
                  : null}
                <Divider />
                <ListItem button onClick={() => dispatch(setLanguageDialogOpen(true))}>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Drawer.Language')} />
                </ListItem>
              </List>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <DrawerRoutes />
            </main>
            <BottomNavigation
              showLabels={false}
              className={classes.bottomNavi}
              value={bottomNaviValue}
            >
              <BottomNavigationAction value="/" label={t('Drawer.Devices')} icon={<AccountTreeIcon />} component={Link} to="/" />
              {isAdmin() ? <BottomNavigationAction value="/settings" label={t('Drawer.Settings')} icon={<SettingsIcon />} component={Link} to="/settings" /> : null}
              {isAdmin() ? <BottomNavigationAction value="/logs" label={t('Drawer.Logs')} icon={<EventNoteIcon />} component={Link} to="/logs" /> : null}
              <BottomNavigationAction label={t('Drawer.Language')} icon={<LanguageIcon />} onClick={() => dispatch(setLanguageDialogOpen(true))} />
            </BottomNavigation>
          </React.Fragment>
        </PrivateRoute>
      </Switch>
    </div>
  );
}