import React, { useEffect, useState } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import avatar from 'images/defaultAvatar.svg'
import { Field, reduxForm } from 'redux-form'
import InputField from 'components/InputField'
import classNames from 'classnames'
import classes from './MyAccount.module.scss'
import Button from 'components/Button'
import ModalChangeImage from 'components/ModalChangeImage'
import TextAreaField from 'components/TextAreaField'
import * as Api from 'api/api'
import { showNotification } from 'layout/CommonLayout/actions'
import { connect } from 'react-redux'
import web3 from 'utils/smartContract/web3'
import smartContractUser from 'utils/smartContract/smartContractUser'
import SavingLoading from 'components/SideBar/CreateSpace/SavingLoading'
import EventEmitter from 'utils/EventEmitter'
import * as storage from 'utils/storage'

const messages = defineMessages({
  fullName: {
    id: 'MyAccount.fullName',
    defaultMessage: 'Full Name'
  },
  email: {
    id: 'MyAccount.email',
    defaultMessage: 'Email'
  },
  password: {
    id: 'MyAccount.password',
    defaultMessage: 'Mật khẩu'
  },
  passwordPlaceholder: {
    id: 'MyAccount.passwordPlaceholder',
    defaultMessage: '******'
  },
  uploadAvatar: {
    id: 'MyAccount.uploadAvatar',
    defaultMessage: 'Upload avatar'
  },
  intro: {
    id: 'MyAccount.intro',
    defaultMessage: 'Introduce Yourself'
  },
  introPlaceholder: {
    id: 'MyAccount.introPlaceholder',
    defaultMessage: 'Introduce Yourself'
  },
  publicKey: {
    id: 'MyAccount.publicKey',
    defaultMessage: 'Public key'
  },
  publicKeyPlaceholder: {
    id: 'MyAccount.publicKeyPlaceholder',
    defaultMessage: 'Sync with MetaMask'
  }
})

const MyAccount = ({
  handleSubmit,
  change,
  showNotification
}) => {
  const [detail, setDetail] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {})
  const [ loading, setLoading ] = useState(false)
  const [ loadingSync, setLoadingSync ] = useState(false)

  useEffect(async () => {
    try {
      const result = await Api.get({
        url: '/user/profile'
      })

      const data = result.data
      change('public_key', data.public_key)
      change('fullname', data.fullname)
      change('intro', data.intro)
      

      setDetail(data)
    } catch(e) {
      console.log(e)
    }
  }, [])

  const submitInfo = async (values) => {
    try {
      setLoading(true)

      await Api.put({
        url: '/user/update-profile',
        data: values
      })

      showNotification({
        type: 'SUCCESS',
        message: 'Update profile success!'
      })

      setDetail((prevDetail) => {
        const data = JSON.stringify({
          ...prevDetail,
          ...values
        })
        localStorage.setItem('userInfo', data)
        storage.setItem('userInfo', data)
        return ({
          ...prevDetail,
          ...values
        })
      })

      EventEmitter.emit('userInfo', { ...detail, ...values })

      setLoading(false)
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }

  const saveAvatar = (avatar_url) => {
    submitInfo({avatar_url})
  }

  const syncWithMetaMask = async () => {
    if (!web3) {
      showNotification({
        type: 'ERROR',
        message: 'Please install MetaMask plugin'
      })
      return
    }
    let walletAddress = localStorage.getItem('walletAddress')
    if (!walletAddress) {
      showNotification({
        type: 'ERROR',
        message: 'Please connect with MetaMask first'
      })
      return
    }
    try {
      let transactionId;
      setLoadingSync(true)
      const result = await smartContractUser.methods.signPublicKey(detail.user_id, detail.username, detail.email).send(
        {
          from: walletAddress
        }, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'ADD',
                summary: 'Sync with MetaMask',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        }
      );
      change('public_key', result.from)
      await submitInfo({
        public_key: result.from
      })

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

      setLoadingSync(false)
    } catch(e) {
      setLoadingSync(false)
    }
  }

  return (
    <div className={classes.container}>
      <p className={classes.title}>
        <FormattedMessage id='AccountInfo.title'
          defaultMessage='My Account'
        />
      </p>

      <div className={classes.row}>
        <div className={classes.avatarWrapper}
        >
          <ModalChangeImage round={true}
            saveAvatar={saveAvatar}
            srcImage={detail.avatar_url || avatar}
          />
        </div>

        <div className={classes.info}>
          <p className={classes.name}>
            {detail.fullname || detail.username}
          </p>
          <p className={classes.email}>
            {detail.email}
          </p>
        
         
        </div>
      </div>

      <form className={classes.form}
        onSubmit={handleSubmit(submitInfo)}
      >
        <div className={classes.publicKey}>
          <Field name='public_key'
            component={InputField}
            label={messages.publicKey}
            placeholder={messages.publicKey}
            h50={true}
            containerStyle={!detail.public_key && classes.customInput}
            readOnly={true}
          />
          { !detail.public_key
            && <div className={classes.actions}>
              <Button className={'btn btnPurple btnSmall'}
                onClick={syncWithMetaMask}
                loading={loadingSync}
              >
                Sign with MetaMask
              </Button>
            </div>
          }
          { loadingSync && <div className={classes.saving}><SavingLoading /></div> }
        </div>
        { !detail.public_key
         && <p className={classes.note}>
          You must Sign the Metamask address to your account first to use full features.
        </p>
        }
        <Field name='fullname'
          component={InputField}
          label={messages.fullName}
          placeholder={messages.fullName}
          h50={true}
        />
        {/* <Field name='email'
          component={InputField}
          label={messages.email}
          placeholder={messages.email}
          h50={true}
        /> */}
        <Field name='intro'
          component={TextAreaField}
          label={messages.intro}
          placeholder={'Introduce yourself'}
          h50={true}
          row={10}
        />

        <Button className={classNames('btn btnLarge btnPurple', classes.btnConfirm)}
          loading={loading}
          type='submit'
        >
          <FormattedMessage id='ChangePassword.confirm'
            defaultMessage='Update profile'
          />
        </Button>
      </form>




    </div>
  )
}

const validate = (values) => {
  const errors = {}

  return errors
}

const MyAccountForm = reduxForm({
  form: 'MyAccount',
  validate,
  enableReinitialize: true,
})(MyAccount)

export default connect(null, {
  showNotification
})(MyAccountForm)