import React, { useState, useEffect, useMemo } from 'react'
import classes from './ManageMembers.module.scss'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Status } from '../AddExistingMembers/AddExistingMembers'
import trashIcon from 'images/trash.png'
import Input from 'components/CreateTask/Input'
// import { deleteAccents } from 'utils/utils'
import plusIcon from 'images/plus-white.svg'
import Dropdown from 'components/Dropdown'
import AddNewMembers from '../AddNewMembers'
import AddExistingMembers from '../AddExistingMembers'
import useSearchMembers from './hooks/useSearchMembers'
import { SelectComponent } from 'components/SelectFieldOrigin/Select'
import { MEMBER_ROLES } from 'utils/constants'
import * as Api from 'api/api'
import { connect } from 'react-redux'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import Loader from 'react-loader-spinner'

const ManageMembers = ({ show, handleClose,
  space, project,
  handleShowConfirm
}) => {
  const currentUserId = useMemo(() => {
    return JSON.parse(localStorage.getItem('userInfo')).user_id
  }, [])
  const [loadingResendInvite, setLoadingResendInvite] = useState({})
  const [loadingChangeRole, setLoadingChangeRole] = useState({})
  const [loadingRemove, setLoadingRemove] = useState({})

  const [display, setDisplay] = useState('MANAGE_MEMBERS')

  const { text, members, handleSearch, setMembers } = useSearchMembers([])

  const [memberIds, setMemberIds] = useState([])

  useEffect(async () => {
    if (display === 'MANAGE_MEMBERS') {
      let url = ''
      if (project) {
        url = `/user/users-in-project/${project.project_id}`
      } else if (space) {
        url = `/user/users-in-workspace/${space.workspace_id}`
      }
  
      const result = await Api.get({
        url
      })
  
      setMembers(result.data)
      setMemberIds(result.data.map((item) => item.user_id))
    }
    
  }, [display])

  const handleRemoveMember = (member) => {
    handleShowConfirm({
      title: 'Confirm',
      description: 'Do you want to remove this member?',
      handleOk: async () => {
        try {
          setLoadingRemove((prevLoading) => ({...prevLoading, [member.user_id]: true}))
          let url = ''
          if (project) {
            url = `/project-user/${project.project_id}/${member.user_id}`
          } else if (space) {
            url = `/workspace-user/${space.workspace_id}/${member.user_id}`
          }
      
          await Api.deleteData({
            url,
          })
    
          setMembers((prevMembers) => prevMembers.filter((item) => item.user_id !== member.user_id))
          setLoadingRemove((prevLoading) => ({...prevLoading, [member.user_id]: false}))
        } catch(e) {
          setLoadingRemove((prevLoading) => ({...prevLoading, [member.user_id]: false}))
        }
      }
    })
  }

  const handleResendInvite = async (member) => {
    try {
      setLoadingResendInvite((prevLoading) => ({...prevLoading, [member.user_id]: true}))
      let url = ''
      if (project) {
        url = `/project/resend-invite-email/${project.project_id}`
      } else if (space) {
        url = `/workspace/resend-invite-email/${space.workspace_id}`
      }
  
      await Api.post({
        url,
        data: {
          emails: [member.email]
        }
      })

      setMembers((prevMembers) => prevMembers.map((item) => item.user_id === member.user_id ? {...item, isSend: true} : item))
      setLoadingResendInvite((prevLoading) => ({...prevLoading, [member.user_id]: false}))
    } catch(e) {
      setLoadingResendInvite((prevLoading) => ({...prevLoading, [member.user_id]: false}))
    }
  }

  const handleChangeRoleMember = async (member, role) => {
    try {
      setLoadingChangeRole((prevLoading) => ({...prevLoading, [member.user_id]: true}))
      let url = ''
      if (project) {
        url = `/project-user/${project.project_id}/${member.user_id}`
      } else if (space) {
        url = `/workspace-user/${space.workspace_id}/${member.user_id}`
      }
  
      await Api.put({
        url,
        data: {
          role
        }
      })

      setMembers((prevMembers) => prevMembers.map((item) => item.user_id === member.user_id ? {...item, role} : item))
      setLoadingChangeRole((prevLoading) => ({...prevLoading, [member.user_id]: false}))
    } catch(e) {
      setLoadingChangeRole((prevLoading) => ({...prevLoading, [member.user_id]: false}))
    }
  }

  return (
    <Modal show={show}
      onHide={handleClose}
      size={'lg'}
    >
      {display === 'MANAGE_MEMBERS'
        && <div className={classes.container}>
          <p className={classes.title}>
            <FormattedMessage id='ManageMembers.title'
              defaultMessage='All members'
            />
          </p>
          <p className={classes.description}>
            <FormattedMessage id='ManageMembers.description'
              defaultMessage='View everyone you’ve invited to "{name}".'
              values={{
                name: space ? space.workspace_name : project.project_name
              }}
            />

          </p>

          <div className={classes.rowBetween}>
            <div className={classes.row}>
              <p className={classes.label}>
                <FormattedMessage id='ManageMembers.members'
                  defaultMessage='Members'
                />
              </p>
              <Dropdown mainComponent={<a className={classes.btnAddMember}>
                <img src={plusIcon} className={classes.plusIcon} alt='icon' />
              </a>}
                childrenComponent={(handleClose) => (
                  <div className={classes.methods}>
                    <a className={classes.method}
                      onClick={() => {
                        setDisplay('ADD_NEW_MEMBERS')
                        handleClose()
                      }}
                    >
                      Add new members
                  </a>
                    <a className={classes.method}
                      onClick={() => {
                        setDisplay('ADD_EXISTING_MEMBERS')
                        handleClose()
                      }}
                    >
                      Add existing members
                  </a>
                  </div>
                )}
              />

            </div>
            <div className={classes.inputField}>
              <Input value={text}
                onChange={handleSearch}
                placeholder='search...'
              />
            </div>
          </div>


          <div className={'table-responsive'}>
            <table className='table'>
              <thead>
                <tr>
                  <th>
                    Email
                </th>
                  <th>
                    FullName
                </th>
                  <th>
                    Role
                </th>
                  <th>
                    Status
                </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.email}

                  >
                    <td> {member.email} </td>
                    <td> {member.fullname} </td>
                    <td className={classes.roleWrapper}>
                      { member.is_owner === 'y'
                        ? <span>Owner</span>
                        : <SelectComponent input={{
                          value: member.role,
                          onChange: (role) => {
                            handleChangeRoleMember(member, role)
                          }
                        }}
                          options={MEMBER_ROLES}
                        />
                      }
                      
                      { loadingChangeRole[member.user_id]
                        && <div className={classes.loader}>
                        <Loader type="Oval" color={'#008aff'} height={20} width={20} />
                      </div>
                      }
                     
                    </td>
                    <td>
                      <div className={classes.statusWrapper}>
                        <Status status={member.is_accepted} />
                        {member.is_accepted === 'n'
                          && <>
                            { member.isSend
                              ? <div className={classes.sended}>Sended!</div>
                              : <a className={classes.resend}
                                onClick={() => handleResendInvite(member)}
                              >
                                Resend invite
                                { loadingResendInvite[member.user_id]
                                  && <div className={classes.loader}>
                                  <Loader type="Oval" color={'#008aff'} height={20} width={20} />
                                </div>
                                }
                                
                              </a>
                            }
                            
                          </>
                        }
                      </div>

                    </td>
                    <td>
                      { currentUserId !== member.user_id
                        && member.is_owner === 'n'
                        && <>
                          { loadingRemove[member.user_id]
                            ? <div className={classes.loader}>
                              <Loader type="Oval" color={'#008aff'} height={20} width={20} />
                            </div>
                            : <a className={classes.btnRemove}
                              onClick={() => handleRemoveMember(member)}
                            >
                              <img src={trashIcon} className={classes.trashIcon} alt='trashIcon' />
                            </a>
                          }
                        </>
                      }
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className={classes.actions}>
            <a className={'btn btnSmall'}
              onClick={handleClose}
            >
              Close
          </a>
          </div>
        </div>
      }

      { display === 'ADD_NEW_MEMBERS'
        && <AddNewMembers handleClose={() => setDisplay('MANAGE_MEMBERS')}
            initialValues={{
              members: [{role: 'ASSIGNEE'}, {role: 'ASSIGNEE'}]
            }}
            space={space}
            project={project}
          />
      }

      { display === 'ADD_EXISTING_MEMBERS'
        && <AddExistingMembers handleClose={() => setDisplay('MANAGE_MEMBERS')}
          space={space}
          project={project}
          memberIds={memberIds}
        />
      }

    </Modal>

  )
}

export default connect(null, {
  handleShowConfirm
})(ManageMembers)

