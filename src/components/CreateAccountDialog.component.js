import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCreateAccountDialogOpen,
  setCreateAccountDialogNameTextfield,
  setCreateAccountDialogPasswordTextfield,
  setCreateAccountDialogPermissionsSelect,
  setCreateAccountDialogNameTextfieldError,
  setCreateAccountDialogPasswordTextfieldError,
  setCreateAccountDialogNewpasswordTextfield
} from '../actions/CreateAccountDialog.action';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));

export default function CreateAccountDialog() {
  const classes = useStyles();
  const { t } = useTranslation();
  let history = useHistory();
  const open = useSelector(state => state.CreateAccountDialog.open);
  const name = useSelector(state => state.CreateAccountDialog.name);
  const type = useSelector(state => state.CreateAccountDialog.type);
  const nameError = useSelector(state => state.CreateAccountDialog.nameError);
  const password = useSelector(state => state.CreateAccountDialog.password);
  const passwordError = useSelector(state => state.CreateAccountDialog.passwordError);
  const permissions = useSelector(state => state.CreateAccountDialog.permissions);
  const editAccountId = useSelector(state => state.CreateAccountDialog.editAccountId);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const val = event.target.value;
    const name = event.target.name;
    dispatch(setCreateAccountDialogPasswordTextfieldError(false))
    dispatch(setCreateAccountDialogNameTextfieldError(false))

    if (name === 'name') {
      dispatch(setCreateAccountDialogNameTextfield(val))
    }
    else if (name === 'password') {
      dispatch(setCreateAccountDialogPasswordTextfield(val))
    }
    else if (name === 'newpassword') {
      dispatch(setCreateAccountDialogNewpasswordTextfield(val))
    }
    else {
      dispatch(setCreateAccountDialogPermissionsSelect(val))
    }
  }

  const disableButton = () => {
    if (type === 'edit') {
      if (password.length > 0 && password.length < 8) {
        return true
      }
    }
    else {
      if (password.length < 8 || name.length < 3) {
        return true
      }
    }
    return false
  }

  const register = () => {
    UserService.register(name, password, permissions).then(res => {
      if (res.status === 200) {
        dispatch(setSnackbarText(t('Snackbar.SuccessfulUserCreation'), 'success'))
        dispatch(setSnackbarShown(true))
        dispatch(setCreateAccountDialogPasswordTextfield(''))
        dispatch(setCreateAccountDialogNameTextfield(''))
        dispatch(setCreateAccountDialogOpen(false))
        UserService.getAllAccounts().then(res => {
          dispatch(setUserAccountsList(res.data))
        })
      }
      else if (res.status === 403) {
        dispatch(setSnackbarText(t('Snackbar.Generic403'), 'error'))
        dispatch(setSnackbarShown(true))
        dispatch(setCreateAccountDialogPasswordTextfield(''))
        dispatch(setCreateAccountDialogNameTextfield(''))
        dispatch(setCreateAccountDialogOpen(false))
      }
      else {
        dispatch(setCreateAccountDialogNameTextfieldError(true))
        dispatch(setCreateAccountDialogPasswordTextfieldError(true))
      }
    })
  }

  const edit = () => {
    UserService.editAccount(editAccountId, name, permissions, password === '' ? false : password).then(res => {
      if (res.status === 200) {
        dispatch(setSnackbarText(t('Snackbar.SuccessfulUserEdit'), 'success'))
        dispatch(setCreateAccountDialogPasswordTextfield(''))
        dispatch(setCreateAccountDialogNameTextfield(''))
        dispatch(setSnackbarShown(true))
        dispatch(setCreateAccountDialogOpen(false))
        UserService.getAllAccounts().then(res => {
          dispatch(setUserAccountsList(res.data))
        })
        //if edited account is currently logged in
        if (res._id === AuthService.getCurrentUser()._id) {
          AuthService.logout()
          history.push('/login')
        }
      }
      else if (res.status === 403) {
        dispatch(setSnackbarText(t('Snackbar.Generic403'), 'error'))
        dispatch(setSnackbarShown(true))
      }
      else {
        dispatch(setSnackbarText(t('Snackbar.UnknownError'), 'error'))
        dispatch(setSnackbarShown(true))
      }
    })
  }

  const cancel = () => {
    dispatch(setCreateAccountDialogOpen(false))
    dispatch(setCreateAccountDialogPasswordTextfield(''))
    dispatch(setCreateAccountDialogNameTextfield(''))
  }

  return (
    <Dialog open={open} onClose={() => dispatch(setCreateAccountDialogOpen(false))} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{type === 'create' ? t('CreateAccountDialog.TitleCreate') : t('CreateAccountDialog.TitleEdit')}</DialogTitle>
      <DialogContent>
        {type === 'edit' ?
          <DialogContentText>
            {t('CreateAccountDialog.AccountBeingEditedSubtitle')}<strong>{name}</strong>
          </DialogContentText>
          : null}
        <form className={classes.form}>
          {AuthService.getCurrentUser() !== null ?
            <div>
              <TextField
                disabled={type === 'edit' ? true : false}
                error={nameError}
                helperText={nameError ? t('LoginPage.InvalidLoginPassword') : t('LoginPage.FormLoginTextFieldHelperText')}
                onChange={handleChange}
                name="name"
                value={name}
                autoFocus
                margin="dense"
                id="name"
                label={t('CreateAccountDialog.NameTextField')}
                type="text"
                fullWidth
              />
              <TextField
                error={passwordError}
                helperText={passwordError ? t('LoginPage.InvalidLoginPassword') : t('LoginPage.FormPasswordTextFieldHelperText')}
                onChange={handleChange}
                autoComplete="off"
                value={password}
                name="password"
                margin="dense"
                id="password"
                label={t('CreateAccountDialog.PasswordTextField')}
                type="password"
                fullWidth
              />
              <FormControl className={classes.formControl}>
                <InputLabel id="permissions">{t('CreateAccountDialog.PermissionsSelect')}</InputLabel>
                <Select
                  fullWidth
                  labelId="permissions"
                  id="permissions-select"
                  name="permissions"
                  value={permissions}
                  onChange={handleChange}
                >
                  {AuthService.getCurrentUser().permissions >= 3 ? <MenuItem value={1}>User</MenuItem> : null}
                  {AuthService.getCurrentUser().permissions === 7 ? <MenuItem value={3}>Admin</MenuItem> : null}
                  {AuthService.getCurrentUser().permissions === 7 ? <MenuItem value={7}>SuperAdmin</MenuItem> : null}
                </Select>
              </FormControl>
            </div>
            : null}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => cancel()} color="primary">
          {t('CreateAccountDialog.Cancel')}
        </Button>
        <Button disabled={disableButton()} onClick={() => type === 'edit' ? edit() : register()} color="primary">
          {type === 'create' ? t('CreateAccountDialog.Create') : t('CreateAccountDialog.Update')}
        </Button>
      </DialogActions>
    </Dialog >
  );
}