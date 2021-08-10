import React, { useState } from 'react'
import {
  Field,
  reduxForm
} from 'redux-form'
import { Modal } from 'react-bootstrap'
import classes from './CreatePhase.module.scss'
import { FormattedMessage, defineMessages } from 'react-intl'
import InputField from 'components/InputField'
import Button from 'components/Button'
import phaseIcon from 'images/phase.png'
import SelectField from 'components/SelectField'
import * as Api from 'api/api'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  addPhase,
  updatePhase
} from 'layout/AdminLayout/slices'
import { selectProjectsBySpace } from 'layout/AdminLayout/selectors'
import { checkChainId, checkMetaMask, phasePath, projectPath, spacePath } from 'utils/utils'
import folder from 'utils/smartContract/folder'
import { showNotification } from 'layout/CommonLayout/actions'
import SavingLoading from '../CreateSpace/SavingLoading'
import history from 'utils/history'

const messages = defineMessages({
  phaseName: {
    id: 'CreatePhase.phaseName',
    defaultMessage: 'Phase name'
  },
  phaseNameEmpty: {
    id: 'CreatePhase.phaseNameEmpty',
    defaultMessage: 'Please enter phase name'
  },
  phaseNamePlaceholder: {
    id: 'CreatePhase.phaseNamePlaceholder',
    defaultMessage: 'Enter phase name'
  },
  project: {
    id: 'CreatePhase.project',
    defaultMessage: 'Project'
  }
})

const CreatePhase = ({ show, handleClose, handleSubmit, isEdit,
  projectId,
  projectName,
  spaceId,
  spaceName,
  addPhase,
  updatePhase,
  reset,
  projects,
  showNotification
}) => {
  const [ loading, setLoading ] = useState(false)

  const onSubmitMetaMask = async (values) => {
    try {
      let transactionId;
      let walletAddress = localStorage.getItem('walletAddress')
      let result = null
      if (isEdit) {
        result = await folder.methods.updateFolder(
          values.folder_id,
          values.project.value,
          values.folder_name.trim(),
          'y',
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
                  summary: 'Update phase',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        );
      } else {
        result = await folder.methods.createFolder(
          values.folder_id,
          values.project_id,
          values.folder_name
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
                  summary: 'Add phase',
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

  const CreatePhase = async (values) => {
    if (!checkMetaMask(showNotification, handleClose)) {
      return
    }
    try {
      await checkChainId()
      setLoading(true)

      if (isEdit) {
        const resultMetaMask = await onSubmitMetaMask(values)
        const result = await Api.put({
          url: `/folder/${values.folder_id}`,
          data: {
            folder_name: values.folder_name.trim(),
            project_id: values.project.value,
            txhash: resultMetaMask.transactionHash,
          }
        })
        updatePhase({
          spaceId,
          projectId,
          phase: result.data,
          toProjectId: values.project.value
        })
      } else {
        const result = await Api.post({
          url: '/folder',
          data: {
            folder_name: values.folder_name.trim(),
            project_id: projectId,
          }
        })
        try {
          const resultMetaMask = await onSubmitMetaMask(result.data)
          const resultUpdate = await Api.put({
            url: `/folder/${result.data.folder_id}`,
            data: {
              txhash: resultMetaMask.transactionHash,
            }
          })
          addPhase({
            spaceId,
            projectId,
            phase: resultUpdate.data
          })
  
          history.push(`${spacePath({
              workspace_id: spaceId,
              workspace_name: spaceName
            })}${projectPath({
              project_id: projectId,
              project_name: projectName
            })}${phasePath({
              folder_id: result.data.folder_id,
              folder_name: values.folder_name.trim()
            })}
          `)
        } catch(e) {
          setLoading(false)
          Api.deleteData({
            url: `/folder/${result.data.folder_id}`
          })
          return Promise.reject()
        }
        
      }

      setLoading(false)
      reset()
      handleClose()
    } catch(e) {
      setLoading(false)
    }
    
  }

  return (
    <Modal show={show}
      onHide={handleClose}
      size={'md'}
    >
      <form className={classes.container}
        onSubmit={handleSubmit(CreatePhase)}
      >
        <div className={classes.header}>
          <p className={classes.title}>
            { isEdit
              ? <FormattedMessage id='CreatePhase.editPhase'
                  defaultMessage='Edit phase'
                /> : <FormattedMessage id='CreatePhase.createPhase'
                defaultMessage='Create new phase'
              />
            }
          </p>
          <img src={phaseIcon} className={classes.icon} alt='logo'/>
        </div>
        <div className={classes.content}>
          { isEdit
            && <Field name='project'
              component={SelectField}
              label={messages.project}
              options={projects}
            />
          }

          <Field name='folder_name'
            component={InputField}
            label={messages.phaseName}
            placeholder={messages.phaseNamePlaceholder}
          />

          {/* {isEdit &&
            <>

              <Field name='visible'
                component={SwitchField}
                label={messages.visible}
                size='lg'
                containerStyle={classes.customContainerStyle}
                labelStyle={classes.customLabel}
              />
            </>
          } */}

          <div className={classes.actions}>
            { loading
              ? <SavingLoading />
              : <div />
            }
            <div className={classes.row}>
              <a className={classes.cancel}
                onClick={handleClose}
              >
                <FormattedMessage id='CreatePhase.cancel'
                  defaultMessage='Cancel'
                />
              </a>
              <Button className={classes.btnCreate}
                type='submit'
                loading={loading}
              >
                { isEdit
                  ? <FormattedMessage id='CreatePhase.edit'
                      defaultMessage='Edit'
                    /> : <FormattedMessage id='CreatePhase.create'
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

  if (!values.folder_name || !values.folder_name.trim()) {
    errors.folder_name = messages.phaseNameEmpty
  }

  return errors
}

const CreatePhaseForm = reduxForm({
  form: 'CreatePhase',
  validate,
  enableReinitialize: true,
})(CreatePhase)

const mapStateToProps = createStructuredSelector({
  projects: selectProjectsBySpace()
})

const mapDispatchToProps = {
  addPhase,
  updatePhase,
  showNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePhaseForm)