import React, { useMemo, useState, useEffect } from 'react'
import classes from './AddExistingMembers.module.scss'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import Button from 'components/Button'
import check from 'images/check.svg'
import checked from 'images/checked.svg'
import Input from 'components/CreateTask/Input'
import useSearchMembers from '../ManageMembers/hooks/useSearchMembers'
import { SelectComponent } from 'components/SelectFieldOrigin/Select'
import { MEMBER_ROLES } from 'utils/constants'
import * as Api from 'api/api'
import { showNotification } from 'layout/CommonLayout/actions'
import {connect} from 'react-redux'

export const Status = ({ status }) => {
  const { text, color } = useMemo(() => {
    switch (status) {
      case 'y':
        return {
          text: 'Accepted',
          color: '#66c066'
        }
      case 'n':
        return {
          text: 'Invited',
          color: '#ffcf00'
        }
      default:
        return {}
    }
  }, [status])

  return (
    <div style={{ color }}>
      { text}
    </div>
  )
}


const AddExistingMembers = ({ handleClose, space, project, memberIds }) => {

  const {text, handleSearch, members, setMembers} = useSearchMembers([])

  useEffect(async () => {

    const result = await Api.get({
      url: '/user/friends'
    })

    setMembers(result.data.filter((item) => memberIds.indexOf(item.user_id) === -1)
      .map((item) => ({...item, role: 'ASSIGNEE'})))
  }, [])


  const [selectedMembers, setSelectedMembers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAddExistingMembers = async () => {
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
          users: members.filter((item) => selectedMembers.indexOf(item.user_id) !== -1)
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
      <div className={classes.container}
      >
        <p className={classes.title}>
          <FormattedMessage id='AddExistingMembers.title'
            defaultMessage='Add existing members to the {name}'
            values={{
              name: space ? `workspace "${space.workspace_name}"` : `project "${project.project_name}"`
            }}
          />
        </p>
        <p className={classes.description}>
          <FormattedMessage id='AddExistingMembers.description'
            defaultMessage=' We’ll invite these members to {name} you add to this group.'
            values={{
              name: space ? `workspace "${space.workspace_name}"` : `project "${project.project_name}"`
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
                <th />
                <th>
                  Email
                </th>
                <th>
                  FullName
                </th>
                <th>
                  Role
                </th>
                {/* <th>
                  Status
                </th> */}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.email}
                  onClick={() => {
                    if (selectedMembers.indexOf(member.user_id) !== -1) {
                      setSelectedMembers((prevMembers) => prevMembers.filter((id) => id !== member.user_id))
                    } else {
                      setSelectedMembers((prevMembers) => [...prevMembers, member.user_id])
                    }
                  }}
                >
                  <td>
                    <img src={selectedMembers.indexOf(member.user_id) === -1 ? check : checked}
                      className={classNames(classes.check, selectedMembers.indexOf(member.user_id) !== -1 && classes.checked)}
                      alt='icon'
                    />
                  </td>
                  <td> {member.email} </td>
                  <td> {member.fullname} </td>
                  <td>
                    <div className={classes.selectRole}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectComponent input={{
                        value: member.role,
                        onChange: (role) => {
                          setMembers((prevMembers) => prevMembers.map((item) => item.user_id === member.user_id ? {...item, role} : item))
                        }
                      }}
                        options={MEMBER_ROLES}
                      />
                    </div>
                    
                  </td>
                  {/* <td> <Status status={member.status} /> </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        <div className={classes.actions}>
          <a className={'btn mr20 btnSmall'}
            onClick={handleClose}
          >
            Cancel
          </a>
          <Button className={'btn btnBlue btnSmall'}
            onClick={handleAddExistingMembers}
            loading={loading}
          >
            Add
          </Button>
        </div>
      </div>

  )
}

export default connect(null, {
  showNotification
})(AddExistingMembers)

