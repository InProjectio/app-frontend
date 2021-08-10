import React, { useState, useMemo, useRef } from 'react'
import classes from './Attachments.module.scss'
import paperclip from 'images/paperclip.svg'
import { FormattedMessage } from 'react-intl'
import AddAttachment from '../AddAttachment'
import useShowPopup from '../hooks/useShowPopup'
import Attachment from './Attachment'
import LoadingAttachment from './LoadingAttachment'

const Attachments = ({ attachments, updateAttachments, handleAddAttach,
  numberLoadingAttachments,
  setNumberLoadingAttachment
}) => {
  const addAttachmentRef = useRef(null)


  const [viewAll, setViewAll] = useState(false)

  const [showAddAttachment, setShowAddAttachment] = useShowPopup(addAttachmentRef)
  

  const handleClickAttachment = (item) => {
    console.log(item.url)
    window.open(item.attachment_link)
  }

  const attachmentsDisplay = useMemo(() => {
    return viewAll ? attachments : attachments.slice(0, 4)
  }, [viewAll, attachments])

  const handleDeleteAttachment = (attachment) => {
    const newAttachments = attachments.filter((item) => item.attachment_id !== attachment.attachment_id)
    updateAttachments(newAttachments, true, attachment)
  }

  const handleEditAttachment = (attachment) => {
    const newAttachments = attachments.map((item) => item.attachment_id === attachment.attachment_id ? attachment : item)
    updateAttachments(newAttachments, false, attachment)
  }

  return (
    <div className={classes.container}>
      { (!attachments || attachments.length === 0) && numberLoadingAttachments > 0
        && <div className={classes.contentWrapper}><LoadingAttachment /></div>
      }
      {attachments && attachments.length > 0
        && <>
          <div className={classes.row}>
            <img src={paperclip} className={classes.icon} alt='icon' />
            <p className={classes.title}>
              <FormattedMessage id='Attachments'
                defaultMessage='Attachments'
              />
            </p>
          </div>
          <div className={classes.contentWrapper}>
            { numberLoadingAttachments > 0
              && <LoadingAttachment />
            }
           
            {attachmentsDisplay && attachmentsDisplay.map((item) => (
              <div key={item.attachment_id || item.tempId}>
                { item.attachment_id
                  && <Attachment 
                    handleClickAttachment={handleClickAttachment}
                    item={item}
                    handleDeleteAttachment={handleDeleteAttachment}
                    handleEditAttachment={handleEditAttachment}
                  />
                }
                
              </div>
              
            ))}
            {attachments.length > 4
              && <div className={classes.btnView}
                onClick={() => setViewAll((viewAll) => !viewAll)}
              >
                {viewAll ? <FormattedMessage id='viewLess' defaultMessage='Show fewer attachments.' />
                  : <FormattedMessage id='viewAll'
                    defaultMessage='View all attachments ({numberHidden} hidden)'
                    values={{
                      numberHidden: attachments.length - 4
                    }}
                  />}
              </div>
            }
            <div className={classes.actions}
              ref={addAttachmentRef}
            >
              <a className={classes.btnAdd}
                onClick={() => setShowAddAttachment(true)}
              >
                <FormattedMessage id='Attachments.add'
                  defaultMessage='Add an attachment'
                />
              </a>
              {showAddAttachment
                && <div className={classes.popup}>
                  <AddAttachment handleClose={() => setShowAddAttachment(false)}
                    handleAddAttach={handleAddAttach}
                    setNumberLoadingAttachment={setNumberLoadingAttachment}
                  />
                </div>
              }

            </div>
          </div>

        </>
      }

    </div>
  )
}

export default Attachments
