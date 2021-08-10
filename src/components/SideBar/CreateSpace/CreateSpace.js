import React, { useState } from 'react'
import {
  Field,
  reduxForm
} from 'redux-form'
import { Modal } from 'react-bootstrap'
import classes from './CreateSpace.module.scss'
import { FormattedMessage, defineMessages } from 'react-intl'
import InputField from 'components/InputField'
import Button from 'components/Button'
import spaceIcon from 'images/space.png'
// import DropzoneUploadImage from 'components/DropzoneUploadImage'
import SwitchField from 'components/SwitchField'
import * as Api from 'api/api'
import { connect } from 'react-redux'
import { addSpace,
  updateSpace
} from 'layout/AdminLayout/slices'
import workspace from 'utils/smartContract/workspace'
import { showNotification } from 'layout/CommonLayout/actions'
import SavingLoading from './SavingLoading'
import history from 'utils/history'
import { checkMetaMask, checkChainId } from 'utils/utils'

const messages = defineMessages({
  spaceName: {
    id: 'CreateSpace.spaceName',
    defaultMessage: 'Space name'
  },
  spaceImage: {
    id: 'CreateSpace.spaceImage',
    defaultMessage: 'Image'
  },
  visible: {
    id: 'CreateSpace.visible',
    defaultMessage: 'Visible'
  },
  spaceNamePlaceholder: {
    id: 'CreateSpace.spaceNamePlaceholder',
    defaultMessage: 'Enter space name'
  },
  spaceNameEmpty: {
    id: 'CreateSpace.spaceNameEmpty',
    defaultMessage: 'Please enter space name'
  },
})

const CreateSpace = ({ show,
  handleClose,
  handleSubmit,
  isEdit,
  addSpace,
  updateSpace,
  reset,
  showNotification
}) => {
  const [loading, setLoading] = useState(false)

  const onSubmitMetaMask = async (values) => {
    try {
      let transactionId;
      let walletAddress = localStorage.getItem('walletAddress')
      let result = null
      if (isEdit) {
        result = await workspace.methods.updateWorkspace(
          values.workspace_id,
          values.workspace_name.trim(),
          '',
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
                  summary: 'Update workspace',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        );
      } else {
        result = await workspace.methods.createWorkspace(
          values.workspace_id,
          values.workspace_name,
          '',
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
                  summary: 'Add workspace',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        )
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

  const createSpace = async (values) => {
    if (!checkMetaMask(showNotification, handleClose)) {
      return
    }
    try {
      await checkChainId()
      setLoading(true)
      
      if (isEdit) {
        const resultMetaMask = await onSubmitMetaMask(values)
        const result = await Api.put({
          url: `/workspace/${values.workspace_id}`,
          data: {
            workspace_name: values.workspace_name.trim(),
            // thumbnail_url: (values.thumbnail_url && values.thumbnail_url[0]) ? values.thumbnail_url[0].url : '',
            txhash: resultMetaMask.transactionHash,
            visible: values.visible ? 'y' : 'n',
          }
        })
        updateSpace({
          ...result.data,
          is_owner: 'y',
          role: 'ASSIGNEE'
        })
      } else {
        const result = await Api.post({
          url: '/workspace',
          data: {
            workspace_name: values.workspace_name.trim(),
            // thumbnail_url: values.thumbnail_url && values.thumbnail_url[0] && values.thumbnail_url[0].url,
          }
        })
        try {
          const resultMetaMask = await onSubmitMetaMask(result.data)
          const resultUpdate = await Api.put({
            url: `/workspace/${result.data.workspace_id}`,
            data: {
              txhash: resultMetaMask.transactionHash,
            }
          })
          addSpace({
            ...resultUpdate.data,
            projects: [],
            is_owner: 'y',
            role: 'ASSIGNEE'
          })
          history.push(`/s-${values.workspace_name.trim().toLowerCase().replaceAll(' ', '-')}-${result.data.workspace_id}`)
        } catch(e) {
          await Api.deleteData({
            url: `/workspace/${result.data.workspace_id}`
          })
          setLoading(false)
          return Promise.reject()
          console.log(e)
        }
        
      }

      setLoading(false)
      reset()
      handleClose()
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <Modal show={show}
      onHide={handleClose}
      size={'md'}
    >
      <form className={classes.container}
        onSubmit={handleSubmit(createSpace)}
      >
        <div className={classes.header}>

          <p className={classes.title}>
            {isEdit
              ? <FormattedMessage id='CreateSpace.editSpace'
                defaultMessage='Edit workspace'
              /> : <FormattedMessage id='CreateSpace.createNewSpace'
                defaultMessage='Create new workspace'
              />
            }

          </p>
          <img src={spaceIcon} className={classes.logoSpace} alt='logo' />
        </div>
        <div className={classes.content}>
          <Field name='workspace_name'
            component={InputField}
            label={messages.spaceName}
            placeholder={messages.spaceNamePlaceholder}
          />

          {/* <Field name='thumbnail_url'
            component={DropzoneUploadImage}
            label={messages.spaceImage}
            maxFiles={1}
          /> */}
          {isEdit
            && <Field name='visible'
              component={SwitchField}
              label={messages.visible}
              size='lg'
              containerStyle={classes.customContainerStyle}
              labelStyle={classes.customLabel}
            />
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
                <FormattedMessage id='CreateSpace.cancel'
                  defaultMessage='Cancel'
                />
              </a>
              <Button className={classes.btnCreate}
                type='submit'
                loading={loading}
              >
                {isEdit
                  ? <FormattedMessage id='CreateSpace.edit'
                    defaultMessage='Edit'
                  /> : <FormattedMessage id='CreateSpace.create'
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

  if (!values.workspace_name || !values.workspace_name.trim()) {
    errors.workspace_name = messages.spaceNameEmpty
  }


  return errors
}


const CreateSpaceForm =  reduxForm({
  form: 'CreateSpace',
  validate,
  enableReinitialize: true,
})(CreateSpace)

export default connect(null, {
  addSpace,
  updateSpace,
  showNotification
})(CreateSpaceForm)