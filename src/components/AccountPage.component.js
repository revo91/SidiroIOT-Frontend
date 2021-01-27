import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountFormCurrentPassword, setAccountFormNewPassword, setAccountFormRepeatedNewPassword } from '../actions/AccountPage.action';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
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
}))

export default function AccountPage() {
  const classes = useStyles();
  const { t } = useTranslation();
  const currentPassword = useSelector(state => state.AccountPageReducer.currentPassword);
  const newPassword = useSelector(state => state.AccountPageReducer.newPassword);
  const repeatedNewPassword = useSelector(state => state.AccountPageReducer.repeatedNewPassword);
  const dispatch = useDispatch();
  const [accountDetails, setAccountDetails] = useState({})

  const getMyAccountDetails = useCallback(() => {
    UserService.getMyAccountDetails().then(res => {
      if (res.status === 200) {
        setAccountDetails(res.data)
      }
      else {
        dispatch(setSnackbarText(t('Snackbar.UnknownError'), 'error'))
        dispatch(setSnackbarShown(true))
      }
    })
  }, [dispatch, t])

  useEffect(() => {
    getMyAccountDetails()
  }, [getMyAccountDetails])

  useEffect(() => {
    //reset textfields on route exit
    return () => {
      dispatch(setAccountFormCurrentPassword(''))
      dispatch(setAccountFormNewPassword(''))
      dispatch(setAccountFormRepeatedNewPassword(''))
    }
  }, [dispatch])

  const verify = (textfield) => {
    const lengthErrorText = t('AccountPage.PasswordHelperError8characters');
    const noMatchErrorText = t('AccountPage.PasswordHelperErrorNewPasswordsMatch');

    if (textfield === 'newPassword') {
      if (newPassword.length > 0 && newPassword.length < 8) {
        return {
          error: true,
          text: lengthErrorText
        }
      }

    }
    if (textfield === 'repeatNewPassword') {
      if (repeatedNewPassword.length > 0 && repeatedNewPassword.length < 8) {
        return {
          error: true,
          text: lengthErrorText
        }
      }

    }
    if (newPassword !== repeatedNewPassword && newPassword.length >= 8 && repeatedNewPassword.length >= 8) {
      return {
        error: true,
        text: noMatchErrorText
      }
    }
    return {
      error: false,
      text: ''
    }
  }

  const changePassword = () => {
    UserService.editMyPassword(accountDetails.name, accountDetails.permissions, currentPassword, newPassword).then(res => {
      if (res.status === 200) {
        //reset fields after submit
        dispatch(setAccountFormCurrentPassword(''))
        dispatch(setAccountFormNewPassword(''))
        dispatch(setAccountFormRepeatedNewPassword(''))
        dispatch(setSnackbarText(t('Snackbar.SuccessfulPasswordChange'), 'success'))
        dispatch(setSnackbarShown(true))
      }
      else {
        dispatch(setSnackbarText(t('Snackbar.UnsuccessfulPasswordChange'), 'error'))
        dispatch(setSnackbarShown(true))
      }
    })
  }

  return (
    <div className={classes.root}>
      <Grid container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Grid item xs={12}>
          <Typography variant="h4">{t('AccountPage.Title')}</Typography>
        </Grid>
        <Typography variant="body1">{t('AccountPage.Permissions')}</Typography>
        <Grid container
          justify="center"
          alignItems="flex-start"
          alignContent="center"
          item xs={12}>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
            {accountDetails.permissions >= 1 ? <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={500}><Chip avatar={<Avatar>U</Avatar>} label="User" /></Grow> : null}
            {accountDetails.permissions >= 3 ? <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}><Chip color="primary" avatar={<Avatar>A</Avatar>} label="Admin" /></Grow> : null}
            {accountDetails.permissions === 7 ? <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1500}><Chip color="secondary" avatar={<Avatar>S</Avatar>} label="SuperAdmin" /></Grow> : null}
          </Grid>
        </Grid>
        <Grid container
          justify="center"
          alignItems="center"
          alignContent="center"
          item xs={12}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <form className={classes.form} noValidate autoComplete="off">
              {accountDetails.name ? <TextField fullWidth disabled label={t('AccountPage.NameTextField')} autoComplete="username" defaultValue={accountDetails.name} /> : null}
              <TextField
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => dispatch(setAccountFormCurrentPassword(e.target.value))}
                fullWidth
                label={t('AccountPage.CurrentPasswordTextField')}
              />
              <TextField
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => dispatch(setAccountFormNewPassword(e.target.value))}
                fullWidth
                label={t('AccountPage.NewPasswordTextField')}
                helperText={verify('newPassword').text}
                error={verify('newPassword').error} />
              <TextField
                type="password"
                autoComplete="repeat-new-password"
                value={repeatedNewPassword}
                onChange={(e) => dispatch(setAccountFormRepeatedNewPassword(e.target.value))}
                fullWidth
                label={t('AccountPage.RepeatNewPasswordTextField')}
                helperText={verify('repeatNewPassword').text}
                error={verify('repeatNewPassword').error}
              />
            </form>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Button onClick={() => changePassword()}
            className={classes.loginButton} fullWidth color="primary" variant="contained" disabled={currentPassword.length === 0
              || newPassword.length === 0
              || repeatedNewPassword.length === 0
              || verify('newPassword').error
              || verify('currentPassword').error
              || verify('repeatNewPassword').error}>
            {t('AccountPage.ChangePasswordButton')}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}