import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function MaxCalculatorTable({ maxCalcElementsArray }) {
  const { t } = useTranslation();
  const selectedDevice = useSelector(state => state.DevicesListReducer);
  const allDevices = useSelector(state => state.DevicesSelectionPageReducer.devices);
  const tableView = useSelector(state => state.DevicesSelectionPageReducer.tableView);

  const device = allDevices[selectedDevice.selectedDeviceID]

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
    t('DevicesSelectionPage.Properties.calculationInterval'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick'),
    ]
  }
  maxCalcElementsArray.forEach(calcElement => {
    //associate variableID with variable name
    calcElement = {
      ...calcElement,
      variableIDName: device.variables[calcElement.variableID] !== undefined ? device.variables[calcElement.variableID].name : ''
    }

    if (tableView === 'simple') {
      rows.push([calcElement.name, calcElement.value, calcElement.unit, calcElement.lastValueTick])
    }
    else {
      rows.push([calcElement.name, calcElement.type, calcElement.value, calcElement.unit, calcElement.defaultValue, calcElement.factor, calcElement.sampleTime, calcElement.calculationInterval, calcElement.variableIDName, calcElement.lastValueTick])
    }
  })
  return (
    <UniversalTable columns={cols} rows={rows} />
  )
}