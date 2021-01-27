import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { CollapsibleTable } from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function LowLimitAlertTable({ lowLimitAlertArray }) {
  const { t } = useTranslation();
  const tableView = useSelector(state => state.DevicesSelectionPageReducer.tableView);

  let rows = []
  let cols = []
  let collapsedRows = []
  let collapsedCols = []
  let rowToBeCollapsed = []

  if (tableView === 'simple') {
    cols = [t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  else {
    //push collapsed cols
    collapsedCols = [t('DevicesSelectionPage.Properties.textPL'), t('DevicesSelectionPage.Properties.textEN')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.lowLimit'),
    t('DevicesSelectionPage.Properties.hysteresis'),
    t('DevicesSelectionPage.Properties.severity'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.timeOffDelay'),
    t('DevicesSelectionPage.Properties.timeOnDelay'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  lowLimitAlertArray.forEach((lowLimitAlertElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([lowLimitAlertElement.name, lowLimitAlertElement.value, lowLimitAlertElement.unit, lowLimitAlertElement.lastValueTick])
    }
    else {
      //push Texts property contents into collapsed table
      collapsedRows.push([lowLimitAlertElement.texts.pl, lowLimitAlertElement.texts.en])

      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([lowLimitAlertElement.name,
      lowLimitAlertElement.type,
      lowLimitAlertElement.value,
      lowLimitAlertElement.unit,
      lowLimitAlertElement.defaultValue,
      lowLimitAlertElement.lowLimit,
      lowLimitAlertElement.hysteresis,
      lowLimitAlertElement.severity,
      lowLimitAlertElement.sampleTime,
      lowLimitAlertElement.timeOffDelay,
      lowLimitAlertElement.timeOnDelay,
      lowLimitAlertElement.variableName,
      lowLimitAlertElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='LowLimitAlertTable'
    />
}