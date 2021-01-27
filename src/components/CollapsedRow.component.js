import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { setCollapsibleTableInstance } from '../actions/CollapsibleTable.action';

const useRowStyles = makeStyles({
  expandArrow: {
    maxWidth: '50px'
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

export default function Row({ row, collapsedContent, rowName }) {
  const classes = useRowStyles();
  const rowInstance = useSelector(state => state.CollapsibleTableReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (rowInstance[rowName] === undefined) {
      dispatch(setCollapsibleTableInstance(rowName, false))
    }
  }, [rowName, dispatch, rowInstance])

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className={classes.expandArrow}>
          {collapsedContent !== null && collapsedContent !== undefined ?
            <IconButton aria-label="expand row" size="small" onClick={() => dispatch(setCollapsibleTableInstance(rowName, !rowInstance[rowName]))}>
              {rowInstance[rowName] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            : null}
        </TableCell>
        {row.map((cell, i) => {
          return (
            <TableCell key={i}>
              {cell}
            </TableCell>
          )
        })}
      </TableRow>
      {collapsedContent !== null && collapsedContent !== undefined ?
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={row.length + 1}>
            <Collapse in={rowInstance[rowName]} timeout="auto" unmountOnExit>
              <Box margin={1}>
                {collapsedContent}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        :
        null}
    </React.Fragment>
  );
}