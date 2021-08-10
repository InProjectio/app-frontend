import React, { useEffect, useState, useMemo } from 'react'
import classNames from 'classnames'
import classes from './CreateTask.module.scss'
import { Modal } from 'react-bootstrap'
import closeIcon from 'images/close.svg'
import moment from 'moment'
import AddToCard from './AddToCard'
import Header from './Header'
import Members from './Members'
import Labels from './Labels'
import Description from './Description'
import Checklist from './Checklist'
import Attachments from './Attachments'
import budgetIcon from 'images/budget.png'
import spendIcon from 'images/spend.png'
// import Input from './Input'
import { FormattedField } from 'components/FormatedField/FormattedField'
import Activities from './Activities'
import TaskHeader from './TaskHeader'
import Button from 'components/Button'
import * as Api from 'api/api'
import { checkMetaMask, checkChainId } from 'utils/utils'
import { useDispatch } from 'react-redux'
import smartContractTask from 'utils/smartContract/task'
import smartContractLabel from 'utils/smartContract/label'
import smartContractAttachment from 'utils/smartContract/attachment'
import smartContractChecklist from 'utils/smartContract/checklist'
import smartContractActivity from 'utils/smartContract/activity'
import { showNotification } from 'layout/CommonLayout/actions'
import SavingLoading from 'components/SideBar/CreateSpace/SavingLoading'
import EventEmitter from 'utils/EventEmitter'

let rollBackData = null
let rollBackActivity = null

const CreateTask = ({ handleClose, show, selectedTask, selectedPhase }) => {
  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }, [])
  const dispatch = useDispatch()
  let isEdit = !!selectedTask
  const [taskData, setTaskData] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(0)
  const [error, setError] = useState(false)
  const [activities, setActivities] = useState([])
  const [activitiesPageInfo, setActivitiesPageInfo] = useState({})
  const [numberLoadingAttachments, setNumberLoadingAttachment] = useState(0)
  const [currentRole, setCurrentRole] = useState('')
  // const [rollBackData, setRollBackData] = useState(null)


  const [data, setData] = useState({
    title: '',
    members: [],
    labels: [],
    description: '',
    attachments: [],
    checklist: [],
    budget: null,
    spend: null,
    startDate: moment().add(1, 'day').toDate(),
    dueDate: moment().add(2, 'days').toDate(),
    estimateTime: 0,
    reminder: 0,
    selectedPhase: selectedPhase
  })

  useEffect(async () => {
    if (data.selectedPhase?.project_id) {
      const result = await Api.get({
        url: `/user/users-in-project/${data.selectedPhase?.project_id}`
      })
  
      const memberData = result.data.find((item) => item.user_id === userInfo.user_id)

      setCurrentRole(memberData.role)
    }
    
  }, [data.selectedPhase?.project_id])

  useEffect(async () => {
    try {
      if (selectedTask && selectedTask.task_id) {
        const result = await Api.get({
          url: '/task/activities',
          params: {
            taskId: selectedTask.task_id
          }
        })

        const { docs, ...pageInfo } = result.data
        setActivities(docs)
        setActivitiesPageInfo(pageInfo)

      }

    } catch (e) {
      console.log(e)
    }
  }, [selectedTask && selectedTask.task_id])

  useEffect(async () => {
    try {
      if (selectedTask && selectedTask.task_id) {
        const result = await Api.get({
          url: '/task/detail',
          params: {
            taskId: selectedTask.task_id
          }
        })

        const data = result.data

        const taskData = {
          title: data.result.task_name,
          members: data.members.map((member) => ({ ...member, ...member.user[0] })),
          labels: data.labels.map((label) => ({ ...label, ...label.label[0] })),
          description: data.result.description,
          attachments: data.attachments || [],
          checklist: data.checklist,
          budget: data.result.budget,
          spend: data.result.spend,
          startDate: moment.unix(data.result.start_date).toDate() || moment().add(1, 'day').toDate(),
          dueDate: moment.unix(data.result.end_date).toDate() || moment().add(2, 'days').toDate(),
          estimateTime: data.result.estimate || 0,
          reminder: data.result.duedate_reminder || 0,
          selectedPhase: selectedPhase,
          status: data.result.status,
          task_id: data.result.task_id,
          folder_id: data.result.folder_id,
          create_at: data.result.create_at
        }

        setData(taskData)

        setTaskData(taskData)
      }

    } catch (e) {
      console.log(e)
    }
  }, [selectedTask && selectedTask.task_id])

  const displayNotification = (notification) => {
    dispatch(showNotification(notification))
  }

  const handleEditTask = async (values, taskDataValues) => {
    try {
      setLoadingEdit((prev) => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = null
      let transactionId;
      if (values.task_name) {
        resultMetaMask = await smartContractTask.methods
          .updateTaskName(selectedTask.task_id, values.task_name).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task name',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.description) {
        resultMetaMask = await smartContractTask.methods
          .updateDescription(selectedTask.task_id, values.description).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task description',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.status) {
        resultMetaMask = await smartContractTask.methods
          .updateStatus(selectedTask.task_id, values.status).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task status',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.start_date) {
        resultMetaMask = await smartContractTask.methods
          .updateStartDate(selectedTask.task_id, moment(values.start_date).unix()).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task start date',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.end_date) {
        // thieu reminder
        resultMetaMask = await smartContractTask.methods
          .updateEndDate(selectedTask.task_id, moment(values.end_date).unix(), values.duedate_reminder || 0).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task due date',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.estimate) {
        resultMetaMask = await smartContractTask.methods
          .updateEstimate(selectedTask.task_id, values.estimate).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task estimate',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.budget) {
        resultMetaMask = await smartContractTask.methods
          .updateBudget(selectedTask.task_id, values.budget).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task budget',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.spend) {
        resultMetaMask = await smartContractTask.methods
          .updateSpend(selectedTask.task_id, values.spend).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task spend',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      } else if (values.folder_id) {
        resultMetaMask = await smartContractTask.methods
          .updateFolder(selectedTask.task_id, values.folder_id).send({
            from: walletAddress
          }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update task folder',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
      }

      const result = await Api.put({
        url: `/task/${selectedTask.task_id}`,
        data: {
          ...values,
          txhash: resultMetaMask?.transactionHash
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
      setTaskData((prevData) => ({ ...prevData, ...taskDataValues }))
      if (result.data.activity) {
        setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      }

      handleRefreshTasks()

      setLoadingEdit((prev) => prev - 1)
      
    } catch (e) {
      console.log('error', e)
      setLoadingEdit((prev) => prev - 1)
      console.log('rollBackData', rollBackData)
      setData(rollBackData)
    }
  }

  const handleChangeData = async (values) => {
    console.log('handleChangeData', values)
    if (selectedTask && selectedTask.task_id && !checkMetaMask(displayNotification)) {
      return
    }
    setData((prevData) => {
      rollBackData = prevData
      return ({ ...prevData, ...values })
    })

    if (selectedTask && selectedTask.task_id) {
      await checkChainId()
      if (values.title && values.title !== data.title) {
        handleEditTask({ task_name: values.title }, values)
      }
      if (values.startDate && values.startDate !== data.startDate) {
        await handleEditTask({
          start_date: moment(values.startDate).unix(),
        }, values)
      }
      if (values.dueDate && (data.dueDate !== values.dueDate || data.reminder !== values.reminder)) {
        await handleEditTask({
          end_date: moment(values.dueDate).unix(),
          duedate_reminder: values.reminder,
        }, values)
      }
      if (values.estimateTime && data.estimateTime !== values.estimateTime) {
        await handleEditTask({
          estimate: values.estimateTime,
        }, values)
      }
      if ((values.description && data.description !== values.description)
      ) {
        await handleEditTask(values, values)
      }
      if ((values.status && data.status !== values.status)
      ) {
        await handleEditTask(values, values)
      }

      if ((values.selectedPhase && data.selectedPhase !== values.selectedPhase)
      ) {
        await handleEditTask({folder_id: values.selectedPhase.folder_id},
          {selectedPhase: values.selectedPhase, folder_id: selectedPhase.folder_id})
      }

      if (values.members && values.members !== taskData.members) {
        if (values.isAdd) {
          const membersChange = values.membersChange
          for (let i = 0; i < membersChange.length; i++) {
            await handleAddTaskMember(membersChange[i])
          }
        } else {
          const membersChange = values.membersChange
          for (let i = 0; i < membersChange.length; i++) {
            await handleRemoveTaskMember(membersChange[i])
          }
        }
      }

      if (values.labels && values.labels !== taskData.labels) {
        if (values.isAdd) {
          await handleAddTaskLabel(values.label)
        } else {
          await handleRemoveTaskLabel(values.label)
        }
      }

      if (values.attachments && values.attachments !== taskData.attachments) {
        if (values.isDelete) {
          await handleRemoveAttachment(values.attachment)
        } else {
          await handleSubmitAttachment(values.attachment)
        }
      }

      if (values.checklist && values.checklist !== taskData.checklist) {
        if (values.isDelete) {
          await handleRemoveChecklist(values.checklistItem)
        } else {
          await handleSubmitChecklist(values.checklistItem)
        }
      }

      // handleRefreshTasks()
    }

  }

  const handleRemoveChecklistItem = async (item, itemIndex) => {
    try {
      let transactionId;
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractChecklist.methods
        .deleteChecklistItem(item.item_id)
        .send({from: walletAddress}, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'DELETE',
                summary: 'Delete checklist item',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      const result = await Api.post({
        url: '/task/remove-checklist-item',
        data: {
          item_id: item.item_id,
          item_name: item.item_name,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        checklist: prevTaskData.checklist.map((checklistItem) => {
          if (checklistItem.checklist_id === item.checklist_id) {
            return {
              ...checklistItem,
              items: checklistItem.items.filter((ite) => ite.item_id !== item.item_id)
            }
          }
          return checklistItem
        })
      }))
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleSubmitChecklistItem = async (listItem, item) => {
    try {
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let result
      let resultMetaMask;
      let transactionId;
      if (item.item_id) {
        console.log('item ====>', item.item_id,
        1,
        item.item_name,
        item.completed === 'y' ? 'done' : 'not_yet',
        item.end_date ? item.end_date : moment().unix())
        resultMetaMask = await smartContractChecklist.methods
          .updateChecklistItem(item.item_id,
            1,
            item.item_name,
            item.completed === 'y' ? 'done' : 'not_yet',
            item.end_date ? item.end_date : moment().unix()
          ).send({from: walletAddress}, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update checklist item',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
        result = await Api.post({
          url: '/task/submit-checklist-item',
          data: {
            ...item,
            checklist_id: listItem.checklist_id,
            task_id: selectedTask.task_id,
            txhash: resultMetaMask.transactionHash,
          }
        })
      } else {
        const resultAdd = await Api.post({
          url: '/task/submit-checklist-item',
          data: {
            ...item,
            checklist_id: listItem.checklist_id,
            task_id: selectedTask.task_id,
          }
        })
        try {
          resultMetaMask = await smartContractChecklist.methods
          .createChecklistItem(resultAdd.data.item_id, listItem.checklist_id, item.item_name)
          .send({from: walletAddress}, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'ADD',
                  summary: 'Add checklist item',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
          const resultUpdate = await Api.post({
            url: '/task/submit-checklist-item',
            data: {
              item_id: resultAdd.data.item_id,
              checklist_id: listItem.checklist_id,
              task_id: selectedTask.task_id,
              txhash: resultMetaMask.transactionHash,
              item_name: item.item_name
            }
          })
          result = { data: { result: resultAdd.data, activity: resultUpdate.data.activity } }
        } catch(e) {
          console.log('error ==> 1', e)
          setData(rollBackData)
          await Api.post({
            url: '/task/remove-checklist-item',
            data: {
              item_id: resultAdd.data.item_id,
              item_name: item.item_name,
              task_id: selectedTask.task_id,
            }
          })
          setLoadingEdit((prev) => prev - 1)
          return Promise.reject()
        }
      }

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
      
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      if (!item.item_id && result.data.result) {
        setData((prevData) => ({
          ...prevData,
          checklist: prevData.checklist.map((checklistItem) => {
            if (checklistItem.checklist_id === listItem.checklist_id) {
              const newItems = checklistItem.items.map((ite) => ite.tempId === item.tempId ? result.data.result : ite)
              return {
                ...checklistItem,
                items: newItems
              }
            }
            return checklistItem
          })
        }))
      }

      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        checklist: prevTaskData.checklist.map((checklistItem) => {
          if (checklistItem.checklist_id === listItem.checklist_id) {
            const newItems = item.item_id
              ? checklistItem.items.map(ite => ite.item_id === item.item_id ? item : ite)
              : [...checklistItem.items, result.data.result]
            return {
              ...checklistItem,
              items: newItems
            }
          }
          return checklistItem
        })
      }))

      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      
      console.log('error 2 ==>', e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const updateChecklistItem = (checklist, isDelete, listItem, item, itemIndex) => {
    setData((prevData) => {
      rollBackData = prevData
      return ({
        ...prevData,
        checklist
      })
    })
    if (isDelete) {
      handleRemoveChecklistItem(item, itemIndex)
    } else {
      handleSubmitChecklistItem(listItem, item)
    }
  }

  const handleRemoveChecklist = async (checklistItem) => {
    try {
      let transactionId
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractChecklist.methods
        .deleteChecklist(checklistItem.checklist_id)
        .send({from: walletAddress},async (error, transactionHash) => {
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
      const result = await Api.post({
        url: '/task/remove-checklist',
        data: {
          ...checklistItem,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        checklist: prevTaskData.checklist.filter(item => item.checklist_id !== checklistItem.checklist_id)
      }))
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setLoadingEdit(prev => prev - 1)
      setData(rollBackData)
    }
  }

  const handleSubmitChecklist = async (checklistItem) => {
    try {
      let result;
      let resultMetaMask;
      let transactionId;
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      if (checklistItem.checklist_id) {
        console.log(checklistItem, checklistItem.checklist_id, checklistItem.checklist_title, checklistItem.show_checked_item)
        resultMetaMask = await smartContractChecklist.methods
          .updateChecklist(checklistItem.checklist_id, checklistItem.checklist_title, checklistItem.show_checked_item)
          .send({ from: walletAddress }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update checklist',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
        result = await Api.post({
          url: '/task/submit-checklist',
          data: {
            ...checklistItem,
            task_id: selectedTask.task_id,
            txhash: resultMetaMask.transactionHash
          }
        })
      } else {
        const resultAddNew = await Api.post({
          url: '/task/submit-checklist',
          data: {
            ...checklistItem,
            task_id: selectedTask.task_id,
          }
        })
        try {
          resultMetaMask = await smartContractChecklist.methods
          .createChecklist(resultAddNew.data.checklist_id, selectedTask.task_id, checklistItem.checklist_title)
          .send({ from: walletAddress }, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'ADD',
                  summary: 'Add checklist',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
          const resultUpdate = await Api.post({
            url: '/task/submit-checklist',
            data: {
              checklist_id: resultAddNew.data.checklist_id,
              checklist_title: checklistItem.checklist_title,
              task_id: selectedTask.task_id,
              txhash: resultMetaMask.transactionHash
            }
          })

          result = { data: {result: {...resultAddNew.data, items: []}, activity: resultUpdate.data.activity} }
        } catch(e) {
          await Api.post({
            url: '/task/remove-checklist',
            data: {
              checklist_id: resultAddNew.data.checklist_id,
              task_id: selectedTask.task_id,
              checklist_title: checklistItem.checklist_title
            }
          })
          setData(rollBackData)
          setLoadingEdit(prev => prev - 1)
          return Promise.reject(e)
        }
        
      }
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      if (!checklistItem.checklist_id && result.data.result) {
        setData((prevData) => ({
          ...prevData,
          checklist: prevData.checklist.map((item) => item.tempId === checklistItem.tempId ? result.data.result : item)
        }))
      }
      setTaskData((taskData) => ({
        ...taskData,
        checklist: checklistItem.checklist_id
          ? taskData.checklist.map((item) => item.checklist_id === checklistItem.checklist_id ? checklistItem : item)
          : [...taskData.checklist, result.data.result]
      }))
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleSubmitAttachment = async (attachment) => {
    try {
      setLoadingEdit((prev) => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let result = null
      let transactionId;
      let resultMetaMask;
      if (attachment.attachment_id) {
        resultMetaMask = await smartContractAttachment.methods
          .updateAttachment(attachment.attachment_id, attachment.attachment_name)
          .send({from: walletAddress}, async (error, transactionHash) => {
            if (!error) {
              const result = await Api.post({
                url: '/transaction',
                data: {
                  txhash: transactionHash,
                  type: 'UPDATE',
                  summary: 'Update attachment',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          })
        result = await Api.post({
          url: '/task/submit-attachment',
          data: {
            ...attachment,
            task_id: selectedTask.task_id,
            txhash: resultMetaMask.transactionHash
          }
        })
      } else {
        const resultAddNew = await Api.post({
          url: '/task/submit-attachment',
          data: {
            ...attachment,
            task_id: selectedTask.task_id,
          }
        })
        try {
          resultMetaMask = await smartContractAttachment.methods
          .createAttachment(resultAddNew.data.attachment_id, attachment.attachment_name, attachment.attachment_link,
            selectedTask.task_id)
            .send({from: walletAddress}, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'ADD',
                    summary: 'add attachment',
                    from: walletAddress
                  }
                })
                transactionId = result.data.transaction_id
              }
            })
          const resultUpdate = await Api.post({
            url: '/task/submit-attachment',
            data: {
              attachment_id: resultAddNew.data.attachment_id,
              txhash: resultMetaMask.transactionHash,
              isAddNew: true,
              attachment_link: attachment.attachment_link,
              task_id: selectedTask.task_id
            }
          })
          result = {data: {activity: resultUpdate.data.activity, result: resultAddNew.data}}
        } catch(e) {
          console.log('e', e)
          await Api.post({
            url: '/task/remove-attachment',
            data: {
              task_id: selectedTask.task_id,
              attachment_id: resultAddNew.data.attachment_id
            }
          })
          setData(rollBackData)
          setNumberLoadingAttachment((prevNumber) => prevNumber - 1)
          setLoadingEdit(prev => prev - 1)
          return Promise.reject()
        }
        

      }
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      if (!attachment.attechment_id && result.data.result) {
        setData((prevData) => ({
          ...prevData,
          attachments: prevData.attachments.map((item) => item.tempId === attachment.tempId ? result.data.result : item)
        }))
        setNumberLoadingAttachment((prevNumber) => prevNumber - 1)
      }
      setTaskData((taskData) => ({
        ...taskData,
        attachments: attachment.attachment_id
          ? taskData.attachments.map((item) => item.attachment_id === attachment.attachment_id ? attachment : item)
          : [...taskData.attachments, result.data.result]
      }))
      setLoadingEdit((prev) => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit((prev) => prev - 1)
    }
  }

  const handleRemoveAttachment = async (attachment) => {
    try {
      let transactionId;
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractAttachment.methods
        .deleteAttachment(attachment.attachment_id)
        .send({from: walletAddress}, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'DELETE',
                summary: 'Delete attachment',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      const result = await Api.post({
        url: '/task/remove-attachment',
        data: {
          ...attachment,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        attachments: prevTaskData.attachments.filter((item) => item.attachment_id !== attachment.attachment_id)
      }))
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleAddTaskMember = async (member) => {
    try {
      let transactionId;
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractTask.methods
        .addUserToTask(selectedTask.task_id, member.user_id)
        .send({from: walletAddress},async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'ADD',
                summary: 'Add member',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      const result = await Api.post({
        url: '/task/add-member',
        data: {
          ...member,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        members: [...prevTaskData.members, result.data.result]
      }))
      handleRefreshTasks()
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleRemoveTaskMember = async (member) => {
    try {
      let transactionId
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractTask.methods
        .removeUserFromTask(selectedTask.task_id, member.user_id)
        .send({from: walletAddress}, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'DELETE',
                summary: 'Delete member',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      const result = await Api.post({
        url: '/task/remove-member',
        data: {
          ...member,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        members: prevTaskData.members.filter((mem) => mem.user_id !== member.user_id)
      }))
      handleRefreshTasks()
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
      console.log(e)
    }
  }

  const handleAddTaskLabel = async (label) => {
    try {
      let transactionId;
      setLoadingEdit(prev => prev + 1)

      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractLabel.methods
        .addLabelToTask(label.label_id, selectedTask.task_id)
        .send({from: walletAddress}, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'ADD',
                summary: 'Add task label',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
  
      const result = await Api.post({
        url: '/task/add-label',
        data: {
          ...label,
          task_id: selectedTask.task_id,
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

      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        labels: [...prevTaskData.labels, result.data.result]
      }))
      handleRefreshTasks()
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleRemoveTaskLabel = async (label) => {
    try {
      let transactionId;
      setLoadingEdit(prev => prev + 1)
      let walletAddress = localStorage.getItem('walletAddress')
      let resultMetaMask = await smartContractLabel.methods
        .removeLabelFromTask(label.label_id, selectedTask.task_id)
        .send({from: walletAddress}, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'DELETE',
                summary: 'Delete task label',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      const result = await Api.post({
        url: '/task/remove-label',
        data: {
          ...label,
          task_id: selectedTask.task_id,
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
      setActivities((prevActivities) => ([result.data.activity, ...prevActivities]))
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        labels: prevTaskData.labels.filter((lab) => lab.label_id !== label.label_id)
      }))
      handleRefreshTasks()
      setLoadingEdit(prev => prev - 1)
    } catch (e) {
      console.log(e)
      setData(rollBackData)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleSaveBudget = (budget) => {
    if (!checkMetaMask(displayNotification)) {
      return
    }
    if (selectedTask && selectedTask.task_id && budget && taskData.budget !== budget) {
      handleEditTask({ budget }, { budget })
    }
  }

  const handleSaveSpend = (spend) => {
    if (!checkMetaMask(displayNotification)) {
      return
    }
    if (selectedTask && selectedTask.task_id && spend && taskData.spend !== spend) {
      handleEditTask({ spend }, { spend })
    }
  }

  const handleRefreshTasks = () => {
    EventEmitter.emit('refreshTasks')
  }

  const handleCreateTask = async () => {
    try {
      console.log('data ===>', data)
      if (!data.title || !data.selectedPhase?.folder_id) {
        setError(true)
        return
      }

      if (!checkMetaMask(displayNotification)) {
        return
      }

      await checkChainId()

      setLoading(true)

      const result = await Api.post({
        url: '/task',
        data: {
          folder_id: data.selectedPhase?.folder_id,
          folder: data.selectedPhase._id,
          task_name: data.title,
          txhash: "",
          description: data.description,
          start_date: moment(data.startDate).unix(),
          end_date: moment(data.dueDate).unix(),
          estimate: data.estimateTime,
          duedate_reminder: data.reminder,
          budget: data.budget,
          spend: data.spend,
        }
      })

      try {
        let transactionId;
        let walletAddress = localStorage.getItem('walletAddress')
        const resultMetaMask = await smartContractTask.methods.createTask(
          result.data.task_id,
          data.selectedPhase?.folder_id,
          data.title,
          data.description || '',
          moment(data.startDate).unix(),
          moment(data.dueDate).unix(),
          data.estimate || 0,
          data.reminder || 0,
          data.budget || 0,
          data.spend || 0
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
                  summary: 'Add task',
                  from: walletAddress
                }
              })
              transactionId = result.data.transaction_id
            }
          }
        );

        await Api.put({
          url: `/task/${result.data.task_id}`,
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

      } catch (e) {
        // console.log('error ===>', e)
        handleDeleteTask(result.data.task_id)
        setLoading(false)
        return Promise.reject()
      }

      handleRefreshTasks()

      setLoading(false)

      handleClose()

    } catch (e) {
      setLoading(false)
    }
  }

  const handleAddAttachment = (attachment) => {
    setData((prevData) => {
      rollBackData = prevData
      return ({
        ...prevData,
        attachments: [...prevData.attachments, attachment]
      })
    })

    handleSubmitAttachment(attachment)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      if (!taskId) {
        try {
          let transactionId;
          await checkChainId()
          setLoading(true)
          let walletAddress = localStorage.getItem('walletAddress')
          const resultMetaMask = await smartContractTask.methods.deleteTask(
            selectedTask.task_id
          ).send(
            {
              from: walletAddress
            }, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'DELETE',
                    summary: 'Delete task',
                    from: walletAddress
                  }
                })
                transactionId = result.data.transaction_id
              }
            }
          );
          await Api.deleteData({
            url: `/task/${taskId || selectedTask.task_id}`,
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
          setLoading(false)
  
        } catch (e) {
          // console.log('error ===>', e)
          setLoading(false)
          return Promise.reject()
        }
  
      } else {
        await Api.deleteData({
          url: `/task/${taskId || selectedTask.task_id}`
        })
      }
      
      if (!taskId) {
        handleRefreshTasks()

        handleClose()
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleCreateActivity = async (content) => {
    let resultAdd;
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let transactionId;
      await checkChainId()
      setLoadingEdit(prev => prev + 1)
      const tempId = new Date().valueOf()
      console.log('userInfo ===>', userInfo)
      setActivities((prevActivities) => {
        rollBackActivity = prevActivities
        return [{
          tempId,
          activity_content: content,
          type: 'COMMENT',
          userId: userInfo
        }, ...prevActivities]
      })
      resultAdd = await Api.post({
        url: '/task/add-activity',
        data: {
          task_id: selectedTask.task_id,
          activity_content: content
        }
      })
      const walletAddress = localStorage.getItem('walletAddress')
      const resultMetaMask = await smartContractActivity.methods.createActivity(
        resultAdd.data.activity_id,
        selectedTask.task_id,
        content
      ).send({
        from: walletAddress
      }, async (error, transactionHash) => {
        if (!error) {
          const result = await Api.post({
            url: '/transaction',
            data: {
              txhash: transactionHash,
              type: 'ADD',
              summary: 'Add activity',
              from: walletAddress
            }
          })
          transactionId = result.data.transaction_id
        }
      })
      await Api.put({
        url: '/task/edit-activity',
        data: {
          task_id: selectedTask.task_id,
          activity_content: content,
          activity_id: resultAdd.data.activity_id,
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

      setActivities((prevActivities) => prevActivities
        .map((activity) => activity.tempId === tempId ? resultAdd.data : activity))
      setLoadingEdit(prev => prev - 1)
    } catch(e) {
      console.log(e)
      setActivities(rollBackActivity)
      await Api.deleteData({
        url: '/task/remove-activity',
        data: {
          activity_id: resultAdd.data.activity_id,
        }
      })
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleEditActivity = async (activity) => {
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let transactionId;
      await checkChainId()
      console.log('activity ===>', activity)
      setLoadingEdit(prev => prev + 1)
      setActivities((prevActivities) => {
        rollBackActivity = prevActivities
        return prevActivities.map((data) => data.activity_id === activity.activity_id ? activity : data)
      })

      const walletAddress = localStorage.getItem('walletAddress')
      const resultMetaMask = await smartContractActivity.methods.updateActivity(
        activity.activity_id,
        activity.activity_content
      ).send({
        from: walletAddress
      }, async (error, transactionHash) => {
        if (!error) {
          const result = await Api.post({
            url: '/transaction',
            data: {
              txhash: transactionHash,
              type: 'UPDATE',
              summary: 'Update activity',
              from: walletAddress
            }
          })
          transactionId = result.data.transaction_id
        }
      })

      await Api.put({
        url: '/task/edit-activity',
        data: {
          task_id: selectedTask.task_id,
          activity_content: activity.activity_content,
          activity_id: activity.activity_id,
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

      setLoadingEdit(prev => prev - 1)
    } catch(e) {
      console.log('test ===>', e)
      setActivities(rollBackActivity)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleRemoveActivity = async (activity_id) => {
    try {
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let transactionId;
      await checkChainId()
      setLoadingEdit(prev => prev + 1)
      setActivities((prevActivities) => {
        rollBackActivity = prevActivities
        return prevActivities.map((data) => {
          if (data.activity_id === activity_id) {
            return {
              ...data,
              deleted: 'y'
            }
          }
          return data
        })
      })

      const walletAddress = localStorage.getItem('walletAddress')
      const resultMetaMask = await smartContractActivity.methods.deleteActivity(
        activity_id,
      ).send({
        from: walletAddress
      }, async (error, transactionHash) => {
        if (!error) {
          const result = await Api.post({
            url: '/transaction',
            data: {
              txhash: transactionHash,
              type: 'DELETE',
              summary: 'Delete activity',
              from: walletAddress
            }
          })
          transactionId = result.data.transaction_id
        }
      })

      await Api.deleteData({
        url: '/task/remove-activity',
        data: {
          activity_id,
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

      setLoadingEdit(prev => prev - 1)
    } catch(e) {
      setActivities(rollBackActivity)
      setLoadingEdit(prev => prev - 1)
    }
  }

  const handleSelectEmoji = async (emoji, activity) => {
    try {
      let isAddNew = true
      activity.emojies.forEach((item) => {
        if (item.emoji === emoji) {
          item.users.forEach((user) => {
            if (user.user_id === userInfo.user_id) {
              isAddNew = false
            }
          })
        }
      })
      if (!checkMetaMask(displayNotification)) {
        return
      }
      let transactionId;
      await checkChainId()
      setLoadingEdit(prev => prev + 1)
      setActivities((prevActivities) => {
        rollBackActivity = prevActivities
        return prevActivities.map((data) => {
          if (data.activity_id === activity.activity_id) {
            let emojies = activity.emojies || []
            if (isAddNew) {
              emojies = [...emojies, {
                emoji: emoji,
                users: [userInfo]
              }]
            } else {
              emojies = emojies.map((item) => {
                if (item.emoji === emoji) {
                  return {
                    ...item,
                    users: item.users.filter((user) => user.user_id !== userInfo.user_id)
                  }
                }
                return item
              })
            }

            return {
              ...activity,
              emojies
            }
          }
          return data
        })
      })
      let resultMetaMask;
      const walletAddress = localStorage.getItem('walletAddress')
      if (isAddNew) {
        resultMetaMask = await smartContractActivity.methods.emojiUser(
          activity.activity_id,
          emoji
        ).send({
          from: walletAddress
        }, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'ADD',
                summary: 'add emojie',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      } else {
        resultMetaMask = await smartContractActivity.methods.removeEmoji(
          activity.activity_id,
          emoji
        ).send({
          from: walletAddress
        }, async (error, transactionHash) => {
          if (!error) {
            const result = await Api.post({
              url: '/transaction',
              data: {
                txhash: transactionHash,
                type: 'DELETE',
                summary: 'remove emojie',
                from: walletAddress
              }
            })
            transactionId = result.data.transaction_id
          }
        })
      }
      
      if (isAddNew) {
        await Api.post({
          url: '/task/add-emoji',
          data: {
            activity_id: activity.activity_id,
            emoji,
            txhash: resultMetaMask.transactionHash 
          }
        })
      } else {
        await Api.post({
          url: '/task/remove-emoji',
          data: {
            activity_id: activity.activity_id,
            emoji,
            txhash: resultMetaMask.transactionHash 
          }
        })
      }
      

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

      setLoadingEdit(prev => prev - 1)
    } catch(e) {
      console.log('test ===>', e)
      setActivities(rollBackActivity)
      setLoadingEdit(prev => prev - 1)
    }
  }

  return (
    <Modal size={isEdit ? 'xlg' : 'lg'}
      show={show}
      className={'customStyle'}
      onHide={handleClose}
    >
      <div className={classNames(currentRole === 'VIEWER' && classes.viewer)}>
        <div className={classes.container}>
          <a className={classNames(classes.closeButton)}
            onClick={handleClose}
          >
            <img src={closeIcon} className={classes.closeIcon} alt='icon' />
          </a>
          <div className={classes.left}>
            <TaskHeader startDate={data.startDate}
              handleChangeStartDate={(startDate) => handleChangeData({ startDate })}
              dueDate={data.dueDate}
              handleChangeDueDate={(dueDate, reminder) => handleChangeData({ dueDate, reminder })}
              estimateTime={data.estimateTime}
              handleChangeEstimateTime={(estimateTime) => handleChangeData({ estimateTime })}
              status={data.status}
              handleChangeStatus={(status) => handleChangeData({ status })}
              isEdit={isEdit}
              handleDeleteTask={handleDeleteTask}
              loading={loadingEdit}
              create_at={data.create_at}
              reminder={data.reminder}

            />
            <div className={classes.head}>
              <Header
                title={data.title}
                selectedPhase={data.selectedPhase}
                handleChangePhase={(selectedPhase) => handleChangeData({ selectedPhase })}
                error={error}
                handleSaveTitle={(title) => handleChangeData({title})}
                isEdit={isEdit}
              />
            </div>
            <div className={classNames(classes.row, classes.pd20, classes.mainContent, isEdit && classes.editMainContent)}
            >
              <div className={classes.content}>
                <div className={classes.rowWrapp}>
                  {data.members && data.members.length > 0
                    && <div className={classes.members}>
                      <Members members={data.members}
                        setMembers={(members, isAdd, membersChange) => handleChangeData({ members, isAdd, membersChange })}
                        projectId={data.selectedPhase?.project_id}
                      />
                    </div>
                  }
                  {data.labels && data.labels.length > 0
                    && <Labels labels={data.labels}
                      setLabels={(labels, isAdd, label) => handleChangeData({ labels, isAdd, label })}
                    />
                  }
                </div>

                <Description description={data.description}
                  onChange={(description) => handleChangeData({ description })}
                  disabled={currentRole === 'VIEWER'}
                />

                <Attachments attachments={data.attachments}
                  updateAttachments={(attachments, isDelete, attachment) => handleChangeData({ attachments, isDelete, attachment })}
                  handleAddAttach={handleAddAttachment}
                  numberLoadingAttachments={numberLoadingAttachments}
                  setNumberLoadingAttachment={setNumberLoadingAttachment}
                />

                <Checklist checklist={data.checklist}
                  updateChecklist={(checklist, isDelete, checklistItem) => {
                    handleChangeData({ checklist, isDelete, checklistItem })
                  }}
                  updateChecklistItem={updateChecklistItem}
                  projectId={data.selectedPhase?.project_id}
                />
                {data.budget !== null
                  && <div className={classes.fieldWrapper}>
                    <img src={budgetIcon} className={classes.fieldIcon} alt='icon' />
                    <div className={classes.field}>
                      <p className={classes.fieldTitle}>
                        Budget
                      </p>
                      <div className={classes.inputWrapper}>
                        <FormattedField
                          input={{
                            value: data.budget,
                            onChange: (budget) => handleChangeData({ budget })
                          }}
                          options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand'
                          }}
                          customClass={classes.customInput}
                          onBlur={handleSaveBudget}
                        />
                      </div>

                    </div>

                  </div>
                }

                {data.spend !== null
                  && <div className={classes.fieldWrapper}>
                    <img src={spendIcon} className={classes.fieldIcon} alt='icon' />
                    <div className={classes.field}>
                      <p className={classes.fieldTitle}>
                        Spend
                  </p>
                      <div className={classes.inputWrapper}>
                        <FormattedField
                          input={{
                            value: data.spend,
                            onChange: (spend) => handleChangeData({ spend })
                          }}
                          options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand'
                          }}
                          customClass={classes.customInput}
                          onBlur={handleSaveSpend}
                        />
                      </div>

                    </div>

                  </div>
                }


              </div>
              <div className={classes.addToCard}>
                <AddToCard members={data.members}
                  labels={data.labels}
                  setMembers={(members, isAdd, membersChange) => handleChangeData({ members, isAdd, membersChange })}
                  setLabels={(labels, isAdd, label) => handleChangeData({ labels, isAdd, label })}
                  checklist={data.checklist}
                  addChecklist={(item) => handleChangeData({ checklist: [...data.checklist, item], isDelete: false, checklistItem: item })}
                  handleAddAttach={handleAddAttachment}
                  budget={data.budget}
                  setBudget={(budget) => {
                    handleChangeData({ budget })
                    handleSaveBudget(budget)
                  }}
                  spend={data.spend}
                  setSpend={(spend) => {
                    handleChangeData({ spend })
                    handleSaveSpend(spend)
                  }}
                  projectId={data.selectedPhase?.project_id}
                  isEdit={isEdit}
                  setNumberLoadingAttachment={setNumberLoadingAttachment}
                />
              </div>
            </div>
            {!isEdit
              && <div className={classes.spaceBetween}>
                <div>
                  {loading
                    && <SavingLoading />
                  }
                </div>
                <div className={classes.actions}>
                  <a className='btn btnSmall mr10'
                    onClick={handleClose}
                  >
                    Cancel
                  </a>
                  <Button className='btn btnBlue btnSmall'
                    loading={loading}
                    onClick={handleCreateTask}
                  >
                    Save
                  </Button>
                </div>
              </div>
            }

          </div>
          {isEdit
            && <div className={classes.activities}>
              <Activities activities={activities}
                activitiesPageInfo={activitiesPageInfo}
                handleCreateActivity={handleCreateActivity}
                handleEditActivity={handleEditActivity}
                handleRemoveActivity={handleRemoveActivity}
                handleSelectEmoji={handleSelectEmoji}
                userInfo={userInfo}
              />
            </div>
          }

        </div>

      </div>
    </Modal>
  )

}

export default CreateTask
