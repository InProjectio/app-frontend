import React, { useState } from 'react'
import classes from './CreateLabel.module.scss'
import { FormattedMessage } from 'react-intl'
import Input from '../Input'
import checkIcon from 'images/check-icon-white.svg'
import * as Api from 'api/api'
import { LABELS } from 'utils/constants'
import Button from 'components/Button'
import { useDispatch } from 'react-redux'
import { showNotification } from 'layout/CommonLayout/actions'
import smartContractLabel from 'utils/smartContract/label'
import { checkMetaMask, convertParamsFromPathname } from 'utils/utils'

const CreateLabel = ({ selectedLabel, handleSaveLabel, handleShowDeleteLabel }) => {
  const dispatch = useDispatch()

  const displayNotification = (notification) => {
    dispatch(showNotification(notification))
  }

  const [ loading, setLoading ] = useState(false)
  const [data, setData] = useState(selectedLabel ? {
    text: selectedLabel.label_name,
    color: selectedLabel.label_color
  } : {
    text: '',
  })

  const handleChangeData = (values) => {
    setData({
      ...data,
      ...values
    })
  }

  const handleSave = async () => {
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let walletAddress = localStorage.getItem('walletAddress')
      let transactionId;
      setLoading(true)
      let result = null
      if (selectedLabel && selectedLabel.label_id) {
        let resultMetaMask = await smartContractLabel.methods
          .update(selectedLabel.label_id, data.text, data.color)
          .send({from: walletAddress}, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update label',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
        result = await Api.put({
          url: `/label/${selectedLabel.label_id}`,
          data: {
            label_name: data.text,
            label_color: data.color,
            txhash: resultMetaMask.transactionHash
          }
        })
        if (transactionId) {
          Api.put({
            url: '/transaction',
            data: {
              transaction_id: transactionId,
              block_hash: resultMetaMask.blockHash,
              block_number: resultMetaMask.blockNumber,
              status: resultMetaMask.status ? 1 : 0
            }
          })
        }
      } else {
        const { spaceId } = convertParamsFromPathname(location.pathname)
        result = await Api.post({
          url: '/label',
          data: {
            label_name: data.text,
            label_color: data.color,
            workspace_id: +spaceId
          }
        })
        try {
          let resultMetaMask = await smartContractLabel.methods
            .create(result.data.label_id, data.text, data.color)
            .send({from: walletAddress}, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'ADD',
                    summary: 'Add label',
                    from: walletAddress
                  }
                })
                transactionId = result.data.transaction_id
              }
            })
          result = await Api.put({
            url: `/label/${result.data.label_id}`,
            data: {
              label_name: data.text,
              label_color: data.color,
              txhash: resultMetaMask.transactionHash
            }
          })
          if (transactionId) {
            Api.put({
              url: '/transaction',
              data: {
                transaction_id: transactionId,
                block_hash: resultMetaMask.blockHash,
                block_number: resultMetaMask.blockNumber,
                status: resultMetaMask.status ? 1 : 0
              }
            })
          }
        } catch(e) {
          console.log(e)
          await Api.deleteData({
            url: `/label/${result.data.label_id}`
          })
          setLoading(false)
          return Promise.reject()
        }
        
      }

      setLoading(false)
     
      handleSaveLabel(result.data)

      
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <div className={classes.container}>
      <p className={classes.label}>
        <FormattedMessage id='CreateLabel.name'
          defaultMessage='Name'
        />
      </p>
      <Input
        value={data.text || ''}
        onChange={(text) => handleChangeData({ text })}
        autoFocus={true}
      />

      <p className={classes.label}>
        <FormattedMessage id='CreateLabel.selectAColor'
          defaultMessage='Select a color'
        />
      </p>
      <div className={classes.labels}>
        {LABELS.map((label) => (
          <div className={classes.label}
            key={label.code}
            style={{
              backgroundColor: label.color
            }}
            onClick={() => handleChangeData(label)}
          >
            {data.color === label.color
              && <img src={checkIcon} className={classes.checkIcon} alt='check' />
            }
          </div>
        ))}
        <div className={classes.noColor}>
          <p className={classes.noColorTitle}>
            <FormattedMessage id='CreateLabel.noColor'
              defaultMessage='No color.'
            />
          </p>
          <p className={classes.noColorDescription}>
            <FormattedMessage id='CreateLabel.noColorDesc'
              defaultMessage="This won't show up on the front of cards."
            />
          </p>
        </div>
      </div>

      <div className={classes.actions}>
        <Button className={classes.btnCreate}
          onClick={handleSave}
          loading={loading}
        >
          {(selectedLabel && selectedLabel._id)
            ? <FormattedMessage id='CreateLabel.save'
              defaultMessage='Save'
            /> : <FormattedMessage id='CreateLabel.create'
              defaultMessage='Create'
            />
          }

        </Button>
        {
          selectedLabel && selectedLabel._id && <a className={classes.btnDelete}
            onClick={handleShowDeleteLabel}
          >
          <FormattedMessage id='CreateLabel.delete'
            defaultMessage='Delete'
          />
        </a>
        }
        
      </div>
    </div>
  )
}

export default CreateLabel
