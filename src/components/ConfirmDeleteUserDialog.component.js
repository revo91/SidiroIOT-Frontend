import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { setConfirmDeleteUserDialogOpen } from '../actions/ConfirmDeleteUserDialog.action';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";

export default function AlertDialog() {
  const { t } = useTranslation();
  let history = useHistory();
  const open = useSelector(state => state.ConfirmDeleteUserDialogReducer.open);
  const accountNameToBeDeleted = useSelector(state => state.ConfirmDeleteUserDialogReducer.username);
  const accountIdToBeDeleted = useSelector(state => state.ConfirmDeleteUserDialogReducer.id);
  const dispatch = useDispatch();

  const deletePerm = () => {
    UserService.deleteAccount(accountIdToBeDeleted).then(res => {
      if (res.status === 200) {
        dispatch(setConfirmDeleteUserDialogOpen(false));
        dispatch(setSnackbarText(t('Snackbar.SuccessfulUserDeletion')));
        dispatch(setSnackbarShown(true));
        //if edited account is currently logged in
        if (accountIdToBeDeleted === AuthService.getCurrentUser()._id) {
          AuthService.logout()
          history.push('/login')
        }
        else {
          UserService.getAllAccounts().then(res => {
            dispatch(setUserAccountsList(res.data))
          })
        }
      }
      else if (res.status === 403) {
        dispatch(setConfirmDeleteUserDialogOpen(false));
        dispatch(setSnackbarText(t('Snackbar.Generic403')));
        dispatch(setSnackbarShown(true));
      }
      else {
        dispatch(setConfirmDeleteUserDialogOpen(false));
        dispatch(setSnackbarText(t('Snackbar.UnknownError')));
        dispatch(setSnackbarShown(true));
      }
    })
  }

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setConfirmDeleteUserDialogOpen(false))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('ConfirmDeleteUserDialog.Title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('ConfirmDeleteUserDialog.AccountToBeDeleted')}<strong>{accountNameToBeDeleted}</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deletePerm()} color="secondary">
          {t('ConfirmDeleteUserDialog.Confirm')}
        </Button>
        <Button onClick={() => dispatch(setConfirmDeleteUserDialogOpen(false))} color="primary" autoFocus>
          {t('ConfirmDeleteUserDialog.Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}