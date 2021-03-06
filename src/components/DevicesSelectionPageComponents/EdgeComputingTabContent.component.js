import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import IncreaseCalculatorTable from './IncreaseCalculatorTable.component';
import SumCalculatorTable from './SumCalculatorTable.component';
import ExpressionCalculatorTable from './ExpressionCalculatorTable.component';
import ValueFromByteArrayCalculatorTable from './ValueFromByteArrayCalculatorTable.component';
import AverageCalculatorTable from './AverageCalculatorTable.component';
import FactorCalculatorTable from './FactorCalculatorTable.component';
import MaxCalculatorTable from './MaxCalculatorTable.component';
import MinCalculatorTable from './MinCalculatorTable.component';
import { formatDateTime } from '../../utilities/formatDateTime.utility';

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(2)
  }
}));

export default function EdgeComputingTabContent({ calcElementsObject }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const calcElements = Object.values(calcElementsObject).map(calcElement => {
    return {
      ...calcElement,
      value: parseFloat(calcElement.value).toFixed(3),
      lastValueTick: calcElement.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(calcElement.lastValueTick) * 1000))
    }
  })

  const increaseCalculator = calcElements.filter(calcElement => calcElement.type === 'IncreaseCalculator')
  const sumCalculator = calcElements.filter(calcElement => calcElement.type === 'SumCalculator')
  const expressionCalculator = calcElements.filter(calcElement => calcElement.type === 'ExpressionCalculator')
  const valueFromByteArrayCalculator = calcElements.filter(calcElement => calcElement.type === 'ValueFromByteArrayCalculator')
  const factorCalculator = calcElements.filter(calcElement => calcElement.type === 'FactorCalculator')
  const averageCalculator = calcElements.filter(calcElement => calcElement.type === 'AverageCalculator')
  const maxCalculator = calcElements.filter(calcElement => calcElement.type === 'MaxCalculator')
  const minCalculator = calcElements.filter(calcElement => calcElement.type === 'MinCalculator')

  return (
    <React.Fragment>
      {increaseCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.IncreaseCalculator')}</Typography>
          <IncreaseCalculatorTable increaseCalcElementsArray={increaseCalculator} />
        </React.Fragment>
        : null}
      {sumCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.SumCalculator')}</Typography>
          <SumCalculatorTable sumCalcElementsArray={sumCalculator} />
        </React.Fragment>
        : null}
      {expressionCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.ExpressionCalculator')}</Typography>
          <ExpressionCalculatorTable expressionCalcElementsArray={expressionCalculator} />
        </React.Fragment>
        : null
      }
      {averageCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.AverageCalculator')}</Typography>
          <AverageCalculatorTable averageCalcElementsArray={averageCalculator} />
        </React.Fragment>
        : null
      }
      {factorCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.FactorCalculator')}</Typography>
          <FactorCalculatorTable factorCalcElementsArray={factorCalculator} />
        </React.Fragment>
        : null
      }
      {maxCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.MaxCalculator')}</Typography>
          <MaxCalculatorTable maxCalcElementsArray={maxCalculator} />
        </React.Fragment>
        : null
      }
      {minCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.MinCalculator')}</Typography>
          <MinCalculatorTable minCalcElementsArray={minCalculator} />
        </React.Fragment>
        : null
      }
      {valueFromByteArrayCalculator.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.ValueFromByteArrayCalculator')}</Typography>
          <ValueFromByteArrayCalculatorTable valueFromByteArrayCalcElementsArray={valueFromByteArrayCalculator} />
        </React.Fragment>
        : null
      }
    </React.Fragment>
  )
}