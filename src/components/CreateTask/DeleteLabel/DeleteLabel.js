import React from 'react'
import classes from './DeleteLabel.module.scss'
import { FormattedMessage } from 'react-intl'
import Button from 'components/Button'

const DeleteLabel = ({ handleDeleteLabel, loading }) => {
  return (
    <div className={classes.container}>
      <p className={classes.message}>
        <FormattedMessage id='DeleteLabel.message'
          defaultMessage='There is no undo. This will remove this label from all cards and destroy its history.'
        />
      </p>
      <Button className={classes.btnDelete}
        onClick={handleDeleteLabel}
        loading={loading}
      >
        <FormattedMessage id='DeleteLabel.delete'
          defaultMessage='Delete'
        />
      </Button>
    </div>
  )
}

export default DeleteLabel
