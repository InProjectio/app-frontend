import React, { useRef, useState } from 'react'
import classes from './Members.module.scss'
import plusIcon from 'images/plus-black.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import { FormattedMessage } from 'react-intl'
import SelectMembers from '../SelectMembers'
import useShowPopup from '../hooks/useShowPopup'
import ViewMember from '../ViewMember'

const Members = ({ members, setMembers, projectId }) => {
  const membersRef = useRef(null)
  const selectMemberRef = useRef(null)
  const [showSelectMember, setShowSelectMember] = useShowPopup(selectMemberRef)

  const [ showViewMember, setShowViewMember ] = useShowPopup(membersRef)
  const [ selectedMember, setSelectedMember ] = useState(null)

  const handleRemoveMember = (member) => {
    const newMembers = members.filter((item) => item.user_id !== member.user_id)
    setMembers(newMembers, false, [member])
  }

  return (
    <div className={classes.container}
      ref={selectMemberRef}
    >
      <p className={classes.title}>
        <FormattedMessage id='Members.members'
          defaultMessage='Members'
        />
      </p>
      <div className={classes.row}>
        <div className={classes.members}
          ref={membersRef}
        >
          {members.map((member, i) => (
            <div className={classes.member}
              key={member.user_id}
              onClick={() => {
                setSelectedMember({...member, index: i})
                setShowViewMember(true)
              }}
            >
              <img src={member.avatar_url || defaultAvatar} className={classes.avatar} alt='avatar' />
            </div>
          ))}
          { showViewMember
            && <div className={classes.viewMember}
              style={{
                left: selectedMember ? selectedMember.index * 36 : 0
              }}
            >
              <ViewMember handleClose={() => setShowViewMember(false)}
                member={selectedMember}
                handleRemove={handleRemoveMember}
              />
            </div>
          }
          
        </div>
       
        <div className={classes.btnWrapper}>
          <a className={classes.btnAddMember}
            onClick={() => setShowSelectMember(true)}
          >
            <img src={plusIcon} className={classes.plusIcon} alt='icon' />

          </a>
          {showSelectMember
            && <div className={classes.selectMembers}>
              <SelectMembers selectedMembers={members}
                setSelectedMembers={setMembers}
                handleClose={() => {
                  console.log('tung test ===>')
                  setShowSelectMember(false)
                }}
                projectId={projectId}
              />
            </div>
          }
        </div>


      </div>




    </div>
  )
}

export default Members
