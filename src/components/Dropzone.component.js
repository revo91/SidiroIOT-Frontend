import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setConfigFile } from '../actions/Settings.action';

const useStyles = makeStyles((theme) => ({
  dropzoneText: {
    color: 'rgb(140 140 140)'
  },
}));

export default function Dropzone() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    dispatch(setConfigFile(acceptedFiles[0]))
  }, [dispatch])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'application/JSON' });

  const style = useMemo(() => {
    const baseStyle = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      borderWidth: 2,
      borderRadius: 2,
      borderColor: 'rgb(187 187 187)',
      borderStyle: 'dashed',
      backgroundColor: 'rgb(255 255 255)',
      outline: 'none',
      transition: 'border .5s ease-in-out'
    };

    const activeStyle = {
      borderColor: '#2196f3'
    };

    const acceptStyle = {
      borderColor: '#00e676'
    };

    const rejectStyle = {
      borderColor: '#ff1744'
    };

    return {
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }

  }, [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <section className="container">
      <div {...getRootProps({ style })} className="dropzone">
        <input {...getInputProps()} />
        <Typography variant="body1" className={classes.dropzoneText}>{t('SettingsPage.DropzoneText')}</Typography>
      </div>
    </section>
  );
}