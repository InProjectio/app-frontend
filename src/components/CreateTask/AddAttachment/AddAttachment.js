import React, { useState, useRef } from 'react'
import classes from './AddAttachment.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import Input from '../Input'
import { validURL } from 'utils/validators'
import s3 from 'react-aws-s3'
import moment from 'moment'

const AddAttachment = ({ handleClose, handleAddAttach, attachment, handleEditAttachment,
  setNumberLoadingAttachment
}) => {
  const fileInputRef = useRef()
  const [link, setLink] = useState(attachment ? attachment.attachment_link : '')
  const [linkName, setLinkName] = useState(attachment ? attachment.attachment_name : '')

  const handleAttach = () => {
    if (!link || !validURL(link)) {
      return
    }
    if (attachment) {
      handleEditAttachment({
        ...attachment,
        attachment_link: link,
        attachment_name: linkName,
      })
    } else {
      setNumberLoadingAttachment((prevNumber) => prevNumber + 1)
      handleAddAttach({
        tempId: new Date().valueOf(),
        attachment_link: link,
        attachment_name: linkName,
        attachment_location: 'LINK',
        fileName: '',
        loading: true
      })
    }

    handleClose()
  }

  const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }

  const handleChangeImage = async (e) => {
    const files = e.target.files

    for(let i = 0; i < files.length; i++) {
      setNumberLoadingAttachment((prevNumber) => prevNumber + 1)
      const file = files[i]
      const config = {
        bucketName: process.env.REACT_APP_BUCKET_NAME,
        dirName: '', /* optional */
        region: process.env.REACT_APP_REGION,
        accessKeyId: process.env.REACT_APP_ACCESS_ID,
        secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
      };
      
      const ReactS3Client = new s3(config)
      const result = await ReactS3Client.uploadFile(file, `${moment().unix()}-${file.name}`)
      handleAddAttach({
        tempId: uuidv4(),
        attachment_link: result.location,
        attachment_name: file.name,
        attachment_location: 'UPLOAD',
        fileName: file.name,
        loading: true
      })
    }

    
  }

  const handleClickSelectImage = () => {
    fileInputRef.current.click()
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='AttachFrom' defaultMessage='Attach from...' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        {!attachment
          && <div className={classes.from}>
            <a className={classes.btn}
              onClick={handleClickSelectImage}
            >
              Computer
            </a>
            <input type='file'
              className={classes.file}
              ref={fileInputRef}
              onChange={handleChangeImage}
              multiple="multiple"
            />
          </div>
        }

        <div className={classes.link}>
          {(!attachment || !attachment.attachment_link)
            && <>
              <p className={classes.label}>
                <FormattedMessage id='AttachALink' defaultMessage='Attach a link' />
              </p>
              <Input placeholder='Paste any link here...'
                value={link}
                onChange={setLink}
              />
            </>
          }
          {link
            && <>
              <p className={classes.label}>
                <FormattedMessage id='linkName' defaultMessage='Link name (optional)' />
              </p>
              <Input value={linkName}
                onChange={setLinkName}
              />
            </>
          }

          <div className={classes.actions}>
            <a className={classes.btnAttach}
              onClick={handleAttach}
            >
              { attachment
                ? <FormattedMessage id='Attach.update'
                  defaultMessage='Update'
                  /> : <FormattedMessage id='Attach'
                  defaultMessage='Attach'
                />
              }
              
            </a>
          </div>

        </div>
      </div>
    </div>
  )

}

export default AddAttachment
