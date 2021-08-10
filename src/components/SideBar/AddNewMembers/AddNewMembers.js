import React, { useState } from 'react'
import classes from './AddNewMembers.module.scss'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { Field, reduxForm, FieldArray } from 'redux-form'
import InputField from 'components/InputField'
import SelectField from 'components/SelectFieldOrigin'
import { validateEmail } from 'utils/validators'
import Button from 'components/Button'
import trashIcon from 'images/trash.png'
import plusIcon from 'images/plus-white.svg'
import { MEMBER_ROLES } from 'utils/constants'
import * as Api from 'api/api'
import { showNotification } from 'layout/CommonLayout/actions'
import {connect} from 'react-redux'


const renderMembers = ({ fields, meta: { error, submitFailed, touched } }) => (
  <div>
    {(touched || submitFailed) && error && <span className={classes.errorMessage}>{error}</span>}
    {fields.map((item, index) => (
      <div key={index}
        className={classNames(classes.item, classes.row, (touched || submitFailed) && error && classes.error)}
      >
        <div className={classes.stt}>
          { index + 1 }
        </div>
        <div className={classes.col}>
          <Field name={`${item}.email`}
            component={InputField}
          />
        </div>

        <div className={classes.col}>
          <Field name={`${item}.fullname`}
            component={InputField}
          />
        </div>
        <div className={classes.col}>
          <Field name={`${item}.role`}
            component={SelectField}
            options={MEMBER_ROLES}
          />
        </div>
        <div className={classes.removeCol}>
          <a className={classes.btnRemove}
            onClick={() => fields.remove(index)}
          >
            <img src={trashIcon} className={classes.trashIcon} alt='trashIcon'/>
          </a>
        </div>
      </div>
    ))}
    <div className={classes.addMemberWrapper}>
      <a className={'btn btnBlue btnSmall'}
        onClick={() => fields.push({role: 'ASSIGNEE'})}
      >
        <img src={plusIcon} className={classes.plusIcon} alt='icon'/>
        <FormattedMessage id='addMember'
          defaultMessage='Add member'
        />
      </a>
    </div>
    
  </div>
)

const AddNewMembers = ({ handleClose, handleSubmit, showNotification,
  space, project
}) => {
  const [loading, setLoading] = useState(false)

  const handleAddNewMembers = async (values) => {
    console.log(values)
    try {
      setLoading(true)

      let url = ''

      if (space) {
        url = `/workspace/invite-users/${space.workspace_id}`
      } else if (project) {
        url = `/project/invite-users/${project.project_id}`
      }

      await Api.post({
        url,
        data: {
          users: values.members.filter((item) => item.email)
        }
      })

      showNotification({
        type: 'SUCCESS',
        message: 'Invited users successfully!'
      })

      setLoading(false)

      handleClose()
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
      <form className={classes.container}
        onSubmit={handleSubmit(handleAddNewMembers)}
      >
        <p className={classes.title}>
          <FormattedMessage id='AddNewMembers.title'
            defaultMessage='Add New members to the {name}'
            values={{
              name: space ? `workspace "${space.workspace_name}"` : `project "${project.project_name}"`
            }}
          />
        </p>
        <p className={classes.description}>
          <FormattedMessage id='AddNewMembers.description'
            defaultMessage=' We’ll invite these members to {name} you add to this group.'
            values={{
              name: space ? `workspace "${space.workspace_name}"` : `project "${project.project_name}"`
            }}
          />
         
        </p>

        <p className={classes.label}>
          <FormattedMessage id='AddNewMembers.members'
            defaultMessage='Members'
          />
        </p>

        <div className={classNames(classes.head, classes.row)}>
          <div className={classes.stt}/>
          <div className={classNames(classes.col, classes.headText)}>
            Email
          </div>
          <div className={classNames(classes.col, classes.headText)}>
            Full Name
          </div>
          <div className={classNames(classes.col, classes.headText)}>
            Role
          </div>
          <div className={classes.removeCol}/>
        </div>

        <FieldArray name="members" component={renderMembers}/>

        <div className={classes.actions}>
          <a className={'btn mr20 btnSmall'}
            onClick={handleClose}
          >
            Cancel
          </a>
          <Button className={'btn btnBlue btnSmall'}
            type='submit'
            loading={loading}
          >
            Add
          </Button>
        </div>
      </form>
    
  )
}

const validate = (values) => {
  const errors = {}
  if (values.members) {
    const itemArrayErrors = []
    let hasError = true
    values.members.forEach((item, i) => {
      const itemErrors = {}
      if (hasError && item && item.email && validateEmail(item.email)) {
        hasError = false
      }
      if (item && item.email && !validateEmail(item.email)) {
        itemErrors.email = 'Please enter valid email'
        itemArrayErrors[i] = itemErrors
      }

      if (item && item.email && !item.role) {
        itemErrors.role = 'Please select a role'
        itemArrayErrors[i] = itemErrors
      }
      
    })


    if (itemArrayErrors.length > 0) {
      errors.members = itemArrayErrors
    } else if (hasError) {
      errors.members = {_error: 'Please add at least a member'}
    }
  }


  return errors
}

const AddNewMembersForm = reduxForm({
  form: 'AddNewMembers',
  validate
})(AddNewMembers)


export default connect(null, {
  showNotification
})(AddNewMembersForm)