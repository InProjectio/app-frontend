import React, { useState } from 'react'
import classes from './EstimateTime.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import { FormattedField } from 'components/FormatedField/FormattedField'

const EstimateTime = ({ handleClose, estimateTime, handleChangeEstimateTime }) => {
  const [ text, setText ] = useState(estimateTime)

  const handleSave = () => {
    handleChangeEstimateTime(text)
    handleClose()
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='EstimateTime' defaultMessage='Estimate time' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <p className={classes.label}>
          <FormattedMessage id='time'
            defaultMessage='Time (h)'
          />
        </p>

        <FormattedField
          input={{
            value: text,
            onChange: setText
          }}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand'
          }}
          customClass={classes.customInput}
        />

        <a className={classes.btnSave}
          onClick={handleSave}
        >
          <FormattedMessage id='save' defaultMessage='Save'/>
        </a>

      </div>
    </div>
  )
}

export default EstimateTime
