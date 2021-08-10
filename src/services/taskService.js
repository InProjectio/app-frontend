import * as Api from 'api/api'
import smartContractTask from 'utils/smartContract/task'
import moment from 'moment'

export const updateBudget = async ({task_id, budget}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    const resultMetaMask = await smartContractTask.methods
    .updateBudget(task_id, budget).send({
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
    const result = await Api.put({
      url: `/task/${task_id}`,
      data: {
        budget,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
  
}


export const updateSpend = async ({task_id, spend}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    const resultMetaMask = await smartContractTask.methods
    .updateSpend(task_id, spend).send({
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
    const result = await Api.put({
      url: `/task/${task_id}`,
      data: {
        spend,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const updateEstimate = async ({task_id, estimate}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    const resultMetaMask = await smartContractTask.methods
    .updateEstimate(task_id, estimate).send({
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
    const result = await Api.put({
      url: `/task/${task_id}`,
      data: {
        estimate,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const updateStartDate = async ({task_id, date}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    const resultMetaMask = await smartContractTask.methods
    .updateStartDate(task_id, moment(date).unix()).send({
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
    const result = await Api.put({
      url: `/task/${task_id}`,
      data: {
        start_date: moment(date).unix(),
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
  
}

export const updateDueDate = async ({task_id, end_date, reminder}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    const resultMetaMask = await smartContractTask.methods
    .updateEndDate(task_id, moment(end_date).unix(), reminder || 0).send({
      from: walletAddress
    }, async (error, transactionHash) => {
      if (!error) {
        const result = await Api.post({
          url: '/transaction',
          data: {
            txhash: transactionHash,
            type: 'UPDATE',
            summary: 'Update task end date',
            from: walletAddress
          }
        })
        transactionId = result.data.transaction_id
      }
    })
    const result = await Api.put({
      url: `/task/${task_id}`,
      data: {
        end_date: moment(end_date).unix(),
        duedate_reminder: reminder,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const updateStatus = async ({task_id, status, folder_id}) =>  {
  try {
    let walletAddress = localStorage.getItem('walletAddress')
    let transactionId = null;
    let resultMetaMask;
    if (folder_id) {
      resultMetaMask = await smartContractTask.methods
      .updateStatusAndFolderId(task_id, folder_id, status).send({
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
    } else {
      resultMetaMask = await smartContractTask.methods
        .updateStatus(task_id, status).send({
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
    }
    
    let data = {
      status,
      txhash: resultMetaMask?.transactionHash
    }
    if (folder_id) {
      data = {
        ...data,
        folder_id
      }
    }
    const result = await Api.put({
      url: `/task/${task_id}`,
      data
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const handleAddTaskMember = async ({task_id, member}) => {
  try {
    let transactionId;
    let walletAddress = localStorage.getItem('walletAddress')
    let resultMetaMask = await smartContractTask.methods
      .addUserToTask(task_id, member.user_id)
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
        task_id: task_id,
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

    return result
    
  } catch (e) {
   return Promise.reject(e)
  }
}

export const handleRemoveTaskMember = async ({task_id, member}) => {
  try {
    let transactionId
    let walletAddress = localStorage.getItem('walletAddress')
    let resultMetaMask = await smartContractTask.methods
      .removeUserFromTask(task_id, member.user_id)
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
        task_id: task_id,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const removeAllMembers = async ({task_id}) => {
  try {
    let transactionId
    let walletAddress = localStorage.getItem('walletAddress')
    let resultMetaMask = await smartContractTask.methods
      .removeAllMemberInTask(task_id)
      .send({from: walletAddress}, async (error, transactionHash) => {
        if (!error) {
          const result = await Api.post({
            url: '/transaction',
            data: {
              txhash: transactionHash,
              type: 'DELETE',
              summary: 'Delete all members',
              from: walletAddress
            }
          })
          transactionId = result.data.transaction_id
        }
      })
    const result = await Api.post({
      url: '/task/remove-all-members',
      data: {
        task_id: task_id,
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
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export const handleDeleteTask = async (taskId) => {
  try {
    let transactionId;
    let walletAddress = localStorage.getItem('walletAddress')
    const resultMetaMask = await smartContractTask.methods.deleteTask(
      taskId
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
      url: `/task/${taskId}`,
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
    return Promise.reject(e)
  }

}