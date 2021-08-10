import React, { useState, useMemo } from 'react'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import Input from '../Input'
import Select from '../Select'
import classes from './AddCheckList.module.scss'

const AddCheckList = ({ handleClose, checklist, addChecklist }) => {
  const [ title, setTitle ] = useState('Checklist')
  const [ copyCheckList, setCopyCheckList ] = useState(undefined)

  const handleAddChecklist = () => {
    let selectedChecklist = copyCheckList ? checklist.find((item) => item.checklist_id === copyCheckList) : { items: [] }
    addChecklist({
      ...selectedChecklist,
      checklist_title: title,
      tempId: new Date().valueOf(),
    })
    handleClose()
  }

  const checklistOptions = useMemo(() => {
    return checklist.map((item) => ({
      ...item,
      label: item.checklist_title,
      value: item.checklist_id
    }))
  }, [checklist])

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='addChecklist' defaultMessage='Add checklist' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <p className={classes.label}>
          <FormattedMessage id='title' defaultMessage='Title' />
        </p>
        <Input value={title}
          onChange={setTitle}
        />
        {checklist && checklist.length > 0
          && <>
            <p className={classes.label}>
              <FormattedMessage id='copyItems' defaultMessage='Copy items from…' />
            </p>
            <Select value={copyCheckList}
              handleChange={setCopyCheckList}
              options={checklistOptions}
              placeholder='select...'
              name='checklist'
            />
          </>
        }

       

        <div className={classes.actions}>
          <a className={classes.btnAdd}
            onClick={handleAddChecklist}
          >
            <FormattedMessage id='add'
              defaultMessage='Add'
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default AddCheckList
