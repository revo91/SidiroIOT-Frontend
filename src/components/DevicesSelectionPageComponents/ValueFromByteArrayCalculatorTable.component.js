import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function ValueFromByteArrayCalculatorTable({ valueFromByteArrayCalcElementsArray }) {
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
    t('DevicesSelectionPage.Properties.bitNumber'),
    t('DevicesSelectionPage.Properties.byteNumber'),
    t('DevicesSelectionPage.Properties.length'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick'),
    ]
  }
  valueFromByteArrayCalcElementsArray.forEach(byteArrayElement => {
    //associate variableID with variable name
    byteArrayElement = {
      ...byteArrayElement,
      variableIDName: device.variables[byteArrayElement.variableID] !== undefined ? device.variables[byteArrayElement.variableID].name : ''
    }

    if (tableView === 'simple') {
      rows.push([byteArrayElement.name, byteArrayElement.value, byteArrayElement.unit, byteArrayElement.lastValueTick])
    }
    else {
      rows.push([byteArrayElement.name, byteArrayElement.type, byteArrayElement.value, byteArrayElement.unit, byteArrayElement.defaultValue, byteArrayElement.bitNumber, byteArrayElement.byteNumber, byteArrayElement.length, byteArrayElement.sampleTime, byteArrayElement.variableIDName, byteArrayElement.lastValueTick])
    }
  })
  return <UniversalTable columns={cols} rows={rows} />
}