import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function DeviceConnectionVariableTable({ deviceConnectionVariablesArray }) {
  const { t } = useTranslation();
  const tableView = useSelector(state => state.DevicesSelectionPageReducer.tableView);

  let rows = []
  let cols = []
  if (tableView === 'simple') {
    cols = [t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  else {
    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.lastValueTick'),
    ]
  }
  deviceConnectionVariablesArray.forEach(variable => {
    if (tableView === 'simple') {
      rows.push([variable.name, `${variable.value}`, variable.unit, variable.lastValueTick])
    }
    else {
      rows.push([variable.name, variable.type, `${variable.value}`, variable.unit, variable.defaultValue, variable.sampleTime, variable.lastValueTick])
    }
  })
  return <UniversalTable columns={cols} rows={rows} />
}