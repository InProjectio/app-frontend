import React, { useState } from 'react'
import classes from './Budget.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import { FormattedField } from 'components/FormatedField/FormattedField'

const Budget = ({ handleClose, budget, setBudget }) => {
  const [ text, setText ] = useState(budget)

  const handleSave = () => {
    setBudget(text)
    handleClose()
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='budget' defaultMessage='Budget' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <p className={classes.label}>
          <FormattedMessage id='amountofmoney'
            defaultMessage='Amount of money'
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
          autoFocus={true}
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

export default Budget
