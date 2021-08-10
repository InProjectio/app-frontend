import React, { useState, useMemo, useEffect } from 'react'
import classes from './SelectMembers.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import Input from '../Input'
import defaultAvatar from 'images/defaultAvatar.svg'
import checkIcon from 'images/check-icon.svg'
import EmptyBox from '../EmptyBox'
import * as Api from 'api/api'

let timeout = null

const SelectMembers = ({ selectedMembers, setSelectedMembers, handleClose, projectId, hideSelectAll }) => {
  const [text, setText] = useState('')
  const [ members, setMembers ] = useState([])
  const [MEMBERS, setMEMBERS] = useState([])

  useEffect(async () => {
    console.log(projectId)
    if (projectId) {
      const result = await Api.get({
        url: `/user/users-in-project/${projectId}`
      })
  
      const data = result.data.filter((item) => item.is_accepted === 'y')

      console.log('data===>', data)
  
      setMEMBERS(data)
      setMembers(data)
    }
    
  }, [projectId])

  const selectedMemberIds = useMemo(() => {
    return selectedMembers.map((member) => member.user_id || member)
  }, [selectedMembers])

  console.log('selectedMembers ==>', selectedMembers, selectedMemberIds)

  const handleSearch = (text) => {
    setText(text)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (text) {
        const textSearch = text.toLowerCase()
        const members = MEMBERS.filter((member) => member.fullname.toLowerCase().indexOf(textSearch) !== -1 || member.username.toLowerCase().indexOf(textSearch) !== -1)
        setMembers(members)
      } else {
        setMembers(MEMBERS)
      }
      
    }, 300)
  }

  const handleSelectMember = (member) => {
    if (selectedMemberIds.indexOf(member.user_id) !== -1) {
      setSelectedMembers(selectedMembers.filter((item) => item.user_id !== member.user_id ), false, [member])
    } else {
      setSelectedMembers([...selectedMembers, member], true, [member])
    }
  }

  const handleSelectAll = () => {
    let memberUnselected = members.filter((item) => selectedMemberIds.indexOf(item.user_id) === -1)
    setSelectedMembers([...selectedMembers, ...memberUnselected], true, memberUnselected)
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='SelectMembers.members' defaultMessage='Members'/>}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <Input placeholder='Search members'
          value={text}
          onChange={handleSearch}
          autoFocus={true}
        />
        { members && members.length > 0
          ? <>
            <div className={classes.rowBetween}>
              <p className={classes.title}>
                <FormattedMessage id='SelectMembers.boardMembers'
                  defaultMessage='Board members'
                />
              </p>
              { !hideSelectAll
                && <a className={classes.selectAll}
                onClick={handleSelectAll}
              >
                <FormattedMessage id='selectAll' defaultMessage='Select all'/>
              </a>
              }
              
            </div>
           
            <div className={classes.members}>
              { members.map((member) => (
                <a className={classes.member}
                  key={member.user_id}
                  onClick={() => handleSelectMember(member)}
                >
                  <img src={member.avatar_url || defaultAvatar} className={classes.avatar} alt='avatar'/>
                  <p className={classes.text}>
                    { member.fullname } {member.username && `(${member.username})`}
                  </p>
                  { selectedMemberIds && selectedMemberIds.indexOf(member.user_id) !== -1
                    && <img src={checkIcon} className={classes.checkIcon} alt='checkIcon'/>
                  }
                  
                </a>
              )) }
            </div>
            </>
            : <EmptyBox text={
                <FormattedMessage id='SelectMembers.empty'
                  defaultMessage="Looks like that person isn't a member yet. Enter their email address to add them to the card and board."
                />}
              />
        }
        
      </div>

    </div>
  )
 
}

export default SelectMembers
