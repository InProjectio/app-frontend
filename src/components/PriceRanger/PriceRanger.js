import React, { useState } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import InputRange from 'react-input-range';
import classes from './PriceRanger.module.scss'
import FormatedField from 'components/FormatedField'
import { renderField } from 'Form'

let timeout = null

const messages = defineMessages({
  from: {
    id: 'PriceRanger.from',
    defaultMessage: 'Từ'
  },
  to: {
    id: 'PriceRanger.to',
    defaultMessage: 'Đến'
  }

})

const PriceRanger = (props) => {
  const { input } = props
  
  const [value, setValue] = useState(input.value)
  
  return (
    <div className={classes.container}>
      <div className={classes.inputWrapper}>
        <div className={classes.left}>
          <FormatedField
            options={{
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            }}
            input={{
              value: value.min,
              onChange: (min) => {
                setValue({
                  ...value,
                  min
                })
                if (input.onChange) {
                  input.onChange({
                    ...value,
                    min
                  })
                }
                
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  if (input.handleSearch) {
                    input.handleSearch({
                      ...value,
                      min
                    })
                  }
                }, 300)
              }
            }}
            placeholder={messages.from}
            customClass={classes.inputField}
          />
          <p className={classes.unit}>
            <FormattedMessage id='PriceRanger.unit'
              defaultMessage='triệu'
            />
          </p>
        </div>
        <div className={classes.right}>
          <FormatedField
            options={{
              numeral: true,
              numeralThousandsGroupStyle: 'thousand'
            }}
            input={{
              value: value.max,
              onChange: (max) => {
                setValue({
                  ...value,
                  max
                })
                if (input.onChange) {
                  input.onChange({
                    ...value,
                    max
                  })
                }
                
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  if (input.handleSearch) {
                    input.handleSearch({
                      ...value,
                      max
                    })
                  }
                }, 300)
              }
            }}
            placeholder={messages.to}
            customClass={classes.inputField}
          />
          <p className={classes.unit}>
            <FormattedMessage id='PriceRanger.unit'
              defaultMessage='triệu'
            />
          </p>
        </div>
      </div>
      <div className={classes.inputRangerWrapper}>
        <InputRange
          maxValue={2000}
          minValue={0}
          value={value}
          onChange={value => {
            setValue(value)
            if (input.onChange) {
              input.onChange(value)
            }
           
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              if (input.handleSearch) {
                input.handleSearch(value)
              }
            }, 300)
          }}
          draggableTrack
          formatLabel={() => ''}
          inputRange={classes.inputRanger}
        />
      </div>


    </div>
  )
}

export default renderField(PriceRanger)