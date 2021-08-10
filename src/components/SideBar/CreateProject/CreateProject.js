import React, { useState } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import { Modal } from 'react-bootstrap'
import classes from './CreateProject.module.scss'
import { FormattedMessage, defineMessages } from 'react-intl'
import InputField from 'components/InputField'
import Button from 'components/Button'
import projectIcon from 'images/project.png'
import SelectField from 'components/SelectField'
import SwitchField from 'components/SwitchField'
import * as Api from 'api/api'
import {
  addProject,
  updateProject
} from 'layout/AdminLayout/slices'
import {
  selectSpacesOptions
} from 'layout/AdminLayout/selectors'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import project from 'utils/smartContract/project'
import { showNotification } from 'layout/CommonLayout/actions'
import SavingLoading from '../CreateSpace/SavingLoading'
import history from 'utils/history'
import { checkMetaMask, checkChainId, projectPath, spacePath } from 'utils/utils'

const messages = defineMessages({
  projectName: {
    id: 'CreateProject.projectName',
    defaultMessage: 'Project name'
  },
  projectNameEmpty: {
    id: 'CreateProject.projectNameEmpty',
    defaultMessage: 'Please enter project name'
  },
  space: {
    id: 'CreateProject.space',
    defaultMessage: 'Space'
  },
  visible: {
    id: 'CreateProject.visible',
    defaultMessage: 'Visible'
  }
})

const CreateProject = ({ show, handleClose, handleSubmit, isEdit, spaceId,
  addProject,
  updateProject,
  spaces,
  reset,
  selectedProject,
  showNotification,
  selectedSpace,
  spaceName
}) => {
  const [loading, setLoading] = useState(false)

  const onSubmitMetaMask = async (values) => {
    try {
      let transactionId;
      let walletAddress = localStorage.getItem('walletAddress')
      let result = null
      if (isEdit) {
        result = await project.methods.updateProject(
          values.project_id,
          values.space.value,
          values.project_name.trim(),
          values.visible ? 'y' : 'n',
        ).send(
          {
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update project',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        );
      } else {
        result = await project.methods.createProject(
          values.project_id,
          values.workspace_id,
          values.project_name
        ).send(
          {
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'ADD',
                  summary: 'Add project',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        );
      }


      if (transactionId) {
        Api.put({
          url: '/transaction',
          data: {
            transaction_id: transactionId,
            block_hash: result.blockHash,
            block_number: result.blockNumber,
            status: result.status ? 1 : 0
          }
        })
      }
  
      return result
    } catch(e) {
      console.log(e)
      return Promise.reject()
    }
    
  }

  const createProject = async (values) => {
    if (!checkMetaMask(showNotification, handleClose)) {
      return
    }
    try {
      await checkChainId()
      setLoading(true)

      if (isEdit) {
        const resultMetaMask = await onSubmitMetaMask(values)
        const result = await Api.put({
          url: `/project/${values.project_id}`,
          data: {
            project_name: values.project_name.trim(),
            workspace_id: values.space.value,
            txhash: resultMetaMask.transactionHash,
            visible: values.visible ? 'y' : 'n',
          }
        })
        updateProject({ spaceId,
          project: {
            ...selectedProject,
            ...result.data
          },
          toSpaceId: values.space.value
        })
      } else {
        const result = await Api.post({
          url: '/project',
          data: {
            project_name: values.project_name.trim(),
            workspace_id: spaceId,
          }
        })
        try {
          const resultMetaMask = await onSubmitMetaMask(result.data)
          const resultUpdate = await Api.put({
            url: `/project/${result.data.project_id}`,
            data: {
              txhash: resultMetaMask.transactionHash,
            }
          })
          addProject({ spaceId, project: {
            ...resultUpdate.data,
            is_owner: 'y',
            role: 'ASSIGNEE',
            phases: []
          } })
          history.push(`${spacePath({workspace_id: spaceId, workspace_name: spaceName})}${projectPath({project_id: result.data.project_id, project_name: values.project_name.trim()})}`)
        } catch(e) {
          Api.deleteData({
            url: `/project/${result.data.project_id}`
          })
          setLoading(false)
          return Promise.reject()
        }
        
      }

      setLoading(false)
      reset()
      handleClose()
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <Modal show={show}
      onHide={handleClose}
      size={'md'}
    >
      <form className={classes.container}
        onSubmit={handleSubmit(createProject)}
      >
        <div className={classes.header}>
          <p className={classes.title}>
            {isEdit
              ? <FormattedMessage id='CreateProject.editProject'
                defaultMessage='Edit project'
              /> : <FormattedMessage id='CreateProject.createProject'
                defaultMessage='Create new project'
              />
            }
          </p>
          <img src={projectIcon} className={classes.icon} alt='logo' />
        </div>
        <div className={classes.content}>
          {isEdit &&
            <>
              <Field name='space'
                component={SelectField}
                label={messages.space}
                options={spaces}
              />
            </>
          }

          <Field name='project_name'
            component={InputField}
            label={messages.projectName}
            placeholder="Project A"
          />

          {isEdit &&
            <>

              <Field name='visible'
                component={SwitchField}
                label={messages.visible}
                size='lg'
                containerStyle={classes.customContainerStyle}
                labelStyle={classes.customLabel}
                disabled={selectedSpace?.visible === 'n'}
                note='You can change visible if workspace is visible'
                customNoteStyle={classes.customNote}
              />
            </>
          }

          <div className={classes.actions}>
            { loading
              ? <SavingLoading />
              : <div />
            }
            <div className={classes.row}>
              <a className={classes.cancel}
                onClick={handleClose}
              >
                <FormattedMessage id='CreateProject.cancel'
                  defaultMessage='Cancel'
                />
              </a>
              <Button className={classes.btnCreate}
                type='submit'
                loading={loading}
              >
                {isEdit
                  ? <FormattedMessage id='CreateProject.edit'
                    defaultMessage='Edit'
                  /> : <FormattedMessage id='CreateProject.create'
                    defaultMessage='Create'
                  />
                }

              </Button>
            </div>
            
          </div>
        </div>
      </form>
    </Modal>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.project_name || !values.project_name.trim()) {
    errors.project_name = messages.projectNameEmpty
  }

  if (values.visible && values.space && values.space.visible === 'n') {
    errors.space = 'Cannot set visible project to not visible workspace'
  }

  return errors
}

const CreateProjectForm = reduxForm({
  form: 'CreateProject',
  validate,
  enableReinitialize: true,

})(CreateProject)

const mapStateToProps = createStructuredSelector({
  spaces: selectSpacesOptions(),
})

export default connect(mapStateToProps, {
  addProject,
  updateProject,
  showNotification
})(CreateProjectForm)