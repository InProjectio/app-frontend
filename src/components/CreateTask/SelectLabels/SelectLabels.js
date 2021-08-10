import React, { useState, useMemo, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import classes from './SelectLabels.module.scss'
import Head from '../Head'
import Input from '../Input'
import penIcon from 'images/pen.svg'
import checkIcon from 'images/check-icon-white.svg'
import CreateLabel from '../CreateLabel'
import DeleteLabel from '../DeleteLabel'
import { connect, useDispatch } from 'react-redux'
import { selectLabels } from 'layout/AdminLayout/selectors'
import { setLabels } from 'layout/AdminLayout/slices'
import { createStructuredSelector } from 'reselect'
import * as Api from 'api/api'
import { showNotification } from 'layout/CommonLayout/actions'
import { checkMetaMask } from 'utils/utils'
import smartContractLabel from 'utils/smartContract/label'

let timeout = null

const SelectLabels = ({
  handleClose,
  selectedLabels,
  setSelectedLabels,
  LABELS,
  setLabels: setLABELS
}) => {
  const dispatch = useDispatch()
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [show, setShow] = useState('SELECT_LABELS')
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [text, setText] = useState('')
  const [originLabels, setOriginLabels] = useState(LABELS)
  const [labels, setLabels] = useState((originLabels && originLabels.length > 0) ? originLabels : LABELS)

  useEffect(() => {
    setOriginLabels(LABELS)
  }, [LABELS])

  const displayNotification = (notification) => {
    dispatch(showNotification(notification))
  }

  const selectedLabelIds = useMemo(() => {
    return selectedLabels.map((item) => item._id)
  }, [selectedLabels])

  const handleSearch = (text) => {
    setText(text)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (text) {
        const textSearch = text.toLowerCase()
        const labels = originLabels.filter((label) => label.label_name && label.label_name.toLowerCase().indexOf(textSearch) !== -1)
        setLabels(labels)
      } else {
        setLabels(originLabels)
      }

    }, 300)
  }

  const handleSelectLabel = (label) => {
    if (selectedLabelIds.indexOf(label._id) !== -1) {
      setSelectedLabels(selectedLabels.filter((item) => item._id !== label._id), false, label)
    } else {
      setSelectedLabels([...selectedLabels, label], true, label)
    }
  }

  const handleBack = () => {
    if (show === 'CREATE_LABEL') {
      setShow('SELECT_LABELS')
    } else {
      setShow('CREATE_LABEL')
    }
    
  }

  const handleSaveLabel = (label) => {
    if (selectedLabel && selectedLabel._id) {
      const newOriginLabels = originLabels.map((item) => item._id === label._id ? label : item)
      setLABELS(newOriginLabels)
      setLabels(text ? newOriginLabels.filter((member) => member.text && member.text.toLowerCase().indexOf(text) !== -1) : newOriginLabels)
    } else {
      setText('')
      const newOriginLabels = [...originLabels, label]
      setLABELS(newOriginLabels)
      setLabels(newOriginLabels)
    }

    setShow('SELECT_LABELS')
  }

  const handleShowDeleteLabel = () => {
    setShow('DELETE_LABEL')
  }

  const handleDeleteLabel = async () => {
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let transactionId;
      setLoadingDelete(true)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractLabel.methods
          .deleteLabel(selectedLabel.label_id)
          .send({from: walletAddress}, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'DELETE',
                  summary: 'Delete label',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      await Api.deleteData({
        url: `/label/${selectedLabel.label_id}`,
        data: {
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
      const newOriginLabels = originLabels.filter((item) => item._id !== selectedLabel._id)
      setLABELS(newOriginLabels)
      setLabels(text ? newOriginLabels.filter((member) => member.text && member.text.toLowerCase().indexOf(text) !== -1) : newOriginLabels)
      setShow('SELECT_LABELS')
      setLoadingDelete(false)
    } catch(e) {
      console.log(e)
      setLoadingDelete(false)
    }
    
  }

  const title = useMemo(() => {
    switch(show) {
      case 'CREATE_LABEL':
        return <FormattedMessage id='SelectLabels.createLabel' defaultMessage='Create label' />
      case 'SELECT_LABELS':
        return <FormattedMessage id='SelectLabels.labels' defaultMessage='Labels' />
      case 'DELETE_LABEL':
        return <FormattedMessage id='SelectLabels.deleteLabel' defaultMessage='Delete label?' />
      default:
        return ''
    }
  }, [show])

  return (
    <div className={classes.container}>
      <Head title={title}
        handleClose={handleClose}
        handleBack={(show === 'CREATE_LABEL' || show === 'DELETE_LABEL') && handleBack}
      />
      {show === 'CREATE_LABEL'
        && <CreateLabel selectedLabel={selectedLabel}
          handleSaveLabel={handleSaveLabel}
          handleShowDeleteLabel={handleShowDeleteLabel}

        />
      }
      { show === 'DELETE_LABEL'
        && <DeleteLabel handleDeleteLabel={handleDeleteLabel}
          loading={loadingDelete}
        />
      }
      { show === 'SELECT_LABELS' && <div className={classes.content}>
          <Input placeholder='Search labels'
            value={text}
            onChange={handleSearch}
            autoFocus={true}
          />
          <p className={classes.title}>
            <FormattedMessage id='SelectLabels.labels' defaultMessage='Labels' />
          </p>
          {(labels && labels.length > 0)
            && <div className={classes.labels}>
              {labels.map((label, i) => (
                <div className={classes.labelWrapper}
                  key={label._id}
                >
                  <div className={classes.label}
                    style={{
                      backgroundColor: label.label_color
                    }}
                    onClick={() => handleSelectLabel(label)}
                  >
                    {label.label_name}
                    {selectedLabelIds.indexOf(label._id) !== -1
                      && <img src={checkIcon} className={classes.checkIcon} alt='check' />
                    }

                  </div>
                  <a className={classes.btnEdit}
                    onClick={() => {
                      setSelectedLabel(label)
                      setShow('CREATE_LABEL')
                    }}
                  >
                    <img className={classes.penIcon} src={penIcon} alt='pen-icon' />
                  </a>
                </div>
              ))}
            </div>
          }

          <a className={classes.btnCreateLabel}
            onClick={() => {
              setSelectedLabel((!labels || labels.length === 0) ? { label_name: text } : null)
              setShow('CREATE_LABEL')
            }}
          >
            <FormattedMessage id='SelectLabels.createNewLabel'
              defaultMessage='Create a new {label} label'
              values={{
                label: (!labels || labels.length === 0) ? `"${text}"` : ''
              }}
            />
          </a>
        </div>
      }
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  LABELS: selectLabels()
})

export default connect(mapStateToProps, {
  setLabels
})(SelectLabels)
