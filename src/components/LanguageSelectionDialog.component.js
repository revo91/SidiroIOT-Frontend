import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  title: {
    textAlign: 'center'
  }
});

export default function LanguageDialog() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const open = useSelector(state => state.LanguageDialogReducer.open);
  const dispatch = useDispatch();

  const chooseLanguage = (language) => {
    dispatch(setLanguageDialogOpen(false))
    i18n.changeLanguage(language)
  }

  return (
    <Dialog onClose={() => dispatch(setLanguageDialogOpen(false))} aria-labelledby="simple-dialog-title" open={open} fullWidth={true} maxWidth="sm">
      <DialogTitle className={classes.title} id="simple-dialog-title">{t('LanguageSelection.Label')}</DialogTitle>
      <List>
        <ListItem button onClick={() => chooseLanguage('pl')}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              PL
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t('LanguageSelection.PolishLanguage')} />
        </ListItem>
        <ListItem button onClick={() => chooseLanguage('en')}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              EN
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t('LanguageSelection.EnglishLanguage')} />
        </ListItem>
      </List>
    </Dialog>
  )
}