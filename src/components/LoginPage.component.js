import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Fab from '@material-ui/core/Fab';
import LanguageIcon from "@material-ui/icons/Language";
import Zoom from '@material-ui/core/Zoom';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AuthService from "../services/auth.service";
import { useHistory } from "react-router-dom";
import { setLoginFormUsernameError, setLoginFormPasswordError, setLoginFormUsername, setLoginFormPassword } from '../actions/LoginPage.action';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import SiemensLogoPetrol from '../assets/sie-logo-petrol-rgb.svg';

const useStyles = makeStyles((theme) => ({
  contentDesktop: {
    //flexGrow: 1,
    padding: theme.spacing(1),
    height: '100vh',
    width: '100%'
  },
  contentMobile: {
    padding: theme.spacing(1),
    height: '100%',
    width: '100%'
  },
  loginButton: {
    marginTop: theme.spacing(3)
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  siemensLogo: {
    paddingRight: '15px',
    maxHeight: '19px'
  },
  topBar: {
    [`${theme.breakpoints.up('xs')}`]: {
      maxWidth: '1170px',
      marginLeft: '15px'
    },
    marginTop: '15px',
    marginBottom: '15px',
    height: '100px'
  },
  loginContainer: {
    height: `calc(100% - 150px)`
  }
}));

export default function LoginPage() {
  const classes = useStyles();
  const { t } = useTranslation()
  const theme = useTheme();
  const matches = useMediaQuery(`${theme.breakpoints.down('sm')} and (orientation: landscape)`)
  let history = useHistory();
  const login = useSelector(state => state.LoginPageReducer.username);
  const loginError = useSelector(state => state.LoginPageReducer.usernameError);
  const password = useSelector(state => state.LoginPageReducer.password);
  const passwordError = useSelector(state => state.LoginPageReducer.passwordError);
  const dispatch = useDispatch();

  const tryLogin = () => {
    AuthService.login(login, password).then(() => {
      history.push("/");
    }).catch(() => {
      dispatch(setLoginFormUsernameError(true))
      dispatch(setLoginFormPasswordError(true))
      dispatch(setLoginFormPassword(""))
      dispatch(setSnackbarText(t('Snackbar.LoginFailed'), 'error'))
      dispatch(setSnackbarShown(true))
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && login.length >= 1 && password.length >= 1) {
      tryLogin()
    }
  }

  const buttonLogin = () => {
    tryLogin()
  }

  const controlFormFields = (field, value) => {
    dispatch(setLoginFormUsernameError(false))
    dispatch(setLoginFormPasswordError(false))
    if (field === 'username') {
      dispatch(setLoginFormUsername(value))
    }
    else {
      dispatch(setLoginFormPassword(value))
    }
  }

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <React.Fragment>
      <Zoom
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `500ms`,
        }}
        unmountOnExit
      >
        <Tooltip title={t('LoginPage.Language')} placement="bottom">
          <Fab aria-label="choose langauge" className={classes.fab} color="primary" onClick={() => dispatch(setLanguageDialogOpen(true))}>
            <LanguageIcon />
          </Fab>
        </Tooltip>
      </Zoom>
      <Fade in={true}>
        <Grid className={matches ? classes.contentMobile : classes.contentDesktop}
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="flex-start">
          <Grid item xs={12} className={classes.topBar}>
            <img src={SiemensLogoPetrol} alt="Siemens Logo" className={classes.siemensLogo} />
          </Grid>
          <Grid container item xs={12} spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
            alignContent="center"
            className={classes.loginContainer}>
            <Grid item xs={12} >
              <Typography align="center" variant="h2" gutterBottom>SidiroIOT</Typography>
            </Grid>
            <Grid item xs={12} >
              <Typography align="center" variant="h4" gutterBottom>{t('LoginPage.LoginTitle')}</Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
              <form noValidate autoComplete="off" className={classes.form}>
                <TextField
                  error={loginError}
                  value={login}
                  onChange={(e) => controlFormFields('username', e.target.value)}
                  id="login" label={t('LoginPage.FormLoginTextField')} fullWidth variant="standard" autoComplete="username" onKeyDown={handleKeyDown} />
                <TextField
                  error={passwordError}
                  value={password}
                  onChange={(e) => controlFormFields('password', e.target.value)}
                  id="password" type="password" label={t('LoginPage.FormPasswordTextField')} fullWidth variant="standard" autoComplete="password" onKeyDown={handleKeyDown} />
              </form>
              <Button onClick={() => buttonLogin()} className={classes.loginButton} color="primary" variant="contained" fullWidth disabled={login.length < 1 || password.length < 1}>{t('LoginPage.LoginButton')}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Fade>
    </React.Fragment>
  )
}