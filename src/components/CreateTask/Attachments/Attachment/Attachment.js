import React, { useRef } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import classes from './Attachment.module.scss'
import AttachmentType from '../AttachmentType'
import PopupConfirm from '../../Checklist/PopupConfirm'
import useShowPopup from '../../hooks/useShowPopup'
import AddAttachment from 'components/CreateTask/AddAttachment'

const Attachment = ({ item, handleClickAttachment, handleDeleteAttachment,
  handleEditAttachment
}) => {
  const deleteRef = useRef(null)
  const editRef = useRef(null)

  const [showDeleteAttachment, setShowDeleteAttachment] = useShowPopup(deleteRef)
  const [showEditAttachment, setShowEditAttachment] = useShowPopup(editRef)

  return (
    <div className={classes.item} onClick={() => handleClickAttachment(item)}>
      <AttachmentType item={item} />
      <div className={classes.content}>
        <p className={classes.linkName} >
          {item.attachment_name || item.attachment_link.split('/').pop()}
        </p>
        <div className={classes.description}>
          {moment(item.create_at).fromNow()} - <a className={classes.btn}>
            <FormattedMessage id='comment' defaultMessage='Comment' />
          </a> - <div className={classes.deleteWrapper}
            ref={deleteRef}
            onClick={e => e.stopPropagation()}
          >
            <a className={classes.btn}
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteAttachment(true)
              }}
            >
              <FormattedMessage id='delete' defaultMessage='Delete' />
            </a>
            {showDeleteAttachment
              && <div className={classes.popup}>
                <PopupConfirm title={<FormattedMessage id='removeAttachment.title'
                  defaultMessage='Remove attachment?'
                />}
                  message={<FormattedMessage id='removeAttachment.message'
                    defaultMessage='Remove this attachment? There is no undo.'
                  />}
                  btnText={
                    <FormattedMessage id='remove'
                      defaultMessage='Remove'
                    />
                  }
                  handleClose={() => setShowDeleteAttachment(false)}
                  handleClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAttachment(item)
                  }}

                />
              </div>
            }
          </div> - <div className={classes.editWrapper}
            onClick={e => e.stopPropagation()}
          >
            <a className={classes.btn}
              onClick={(e) => {
                e.stopPropagation()
                setShowEditAttachment(true)
              }}
            >
              <FormattedMessage id='edit' defaultMessage='Edit' />
            </a>
            { showEditAttachment
              && <div className={classes.popup}>
                <AddAttachment attachment={item}
                  handleEditAttachment={handleEditAttachment}
                  handleClose={() => setShowEditAttachment(false)}
                />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attachment
