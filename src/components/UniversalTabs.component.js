// universal tabs component with tabpanels, only horizontal
//pass required prop 'tabs' to it with [{label: yourlabeltext, content: yourcontent}, ...]
// prop required 'name' required for redux active tab index storage

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { setUniversalTabsNameIndex } from '../actions/UniversalTabs.action';
import { useSelector, useDispatch } from 'react-redux';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(8)
  },
  defaultRoot: {
    flexGrow: 1,
    width: '100%',
    marginBottom: '20px'
  },
  noElevation: {
    boxShadow: 'unset'
  },
  tabpanel: {
    overflow: 'auto'
  }
}));

export default function ScrollableTabsButtonForce({ name, tabs }) {
  const classes = useStyles();
  const tabsInstance = useSelector(state => state.UniversalTabsReducer);
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.noElevation}>
        <Tabs
          value={tabsInstance[name] || 0}
          onChange={(event, value) => dispatch(setUniversalTabsNameIndex(name, value))}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="scrollable force tabs"
        >
          {tabs.map((tab, i) => {
            return <Tab key={`tab-${i}`} label={tab.label} {...a11yProps(i)} />
          })}
        </Tabs>
      </AppBar>
      {tabs.map((tab, i) => {
        return <TabPanel key={`tabpanel-${i}`} value={tabsInstance[name] || 0} index={i} className={classes.tabpanel}>
          {tab.content}
        </TabPanel>
      })}
    </div>
  );
}
