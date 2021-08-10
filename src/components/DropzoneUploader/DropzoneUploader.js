import React, { Component } from 'react'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import Dropzone from 'react-dropzone-uploader'
import { renderField } from '../../Form'
// import * as Api from 'api/api'
// import { ServiceUploadUrl } from '../../commons/Config'
import classes from './DropzoneUploader.module.scss'
import s3 from 'react-aws-s3'
import moment from 'moment'

export class DropzoneUploader extends Component {
  state = {
    loading: {}
  }

  getFilesFromEvent = (e) => new Promise((resolve) => {
    getDroppedOrSelectedFiles(e).then((chosenFiles) => {
      resolve(chosenFiles.map((f) => f.fileObject))
    })
  })

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }

  getUploadParams = async ({ meta, file }) => {
    console.log('getUploadParams', file, file.name)
    const formData = new FormData()
    formData.append('files', file)
    this.setState({ uploading: true })
    const size = file.size
    const id = this.uuidv4()
    try {
      const { changeValue } = this.props
      changeValue([...this.props.value, { id, url: file.name, status: 'UPLOADING' }])

      const config = {
        bucketName: process.env.REACT_APP_BUCKET_NAME,
        // dirName: process.env.REACT_APP_DIR_NAME /* optional */,
        region: process.env.REACT_APP_REGION,
        accessKeyId: process.env.REACT_APP_ACCESS_ID,
        secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
      };
      const ReactS3Client = new s3(config)
      const result = await ReactS3Client.uploadFile(file, `${moment().unix()}-${file.name}`)
      console.log(result)
      /*const result = await Api.post({
        url: '/public/upload-compress',
        data: formData,
        options: {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.loaded / size
            this.setState((prevState) => ({
              ...prevState,
              loading: {
                ...prevState.loading,
                [id]: progress
              }
            }))
          }
        }
      })*/

      const newValue = this.props.value.map((item) => {
        if (item.id === id) {
          return {
            url: result.location,
            status: 'DONE'
          }
        }
        return item
      })
      changeValue(newValue)


    } catch (e) {
      const newValue = this.props.value.filter((item) => item.id !== id)
      this.props.changeValue(newValue)
    }
    return {
      // url: `${ServiceUploadUrl}/public/upload-compress`,
    }
  }

  Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const text = files.length > 0 ? 'Thêm tài liệu' : 'Chọn tài liệu'
    const { value } = this.props
    const { loading } = this.state
    return (
      <div className={classes.inputComponent}>
        <div className={classes.files}>
          {value && value.map((file, i) => (
            <div key={i} className={classes.fileWrapper}>
              <div className={classes.file}>
                <a href={file.url}
                  target='_blank'
                  rel="noopener noreferrer"
                  className={classes.fileName}
                >
                  {file.url}
                </a>
                <a className={classes.btnClose}
                  onClick={this.handleRemoveDocument(i)}
                >
                  <FontAwesomeIcon icon={faTimes} className={classes.times} />
                </a>
              </div>
              { loading[file.id] && loading[file.id] !== 1
                && <div className={classes.row}>
                  <div className={classes.progressWrapper}>
                    <div className={classes.progress} style={{ width: `${loading[file.id] * 100}%` }} />
                  </div>
                  <p className={classes.percent}>
                    {`${Math.round(loading[file.id] * 100)}%`}
                  </p>
                </div>
              }

            </div>
          ))}
        </div>
        <p className={classes.text}>
          Kéo thả tài liệu vào đây
          </p>
        <p className={classes.or}>
          Hoặc
         </p>
        <div className={classes.actions}>
          <label className='btn btnBlue btnSmall'>
            {text}
            <input
              style={{ display: 'none' }}
              type="file"
              accept={accept}
              multiple
              ref={(inputRef) => this.inputRef = inputRef}
              onChange={(e) => {
                getFilesFromEvent(e).then((chosenFiles) => {
                  onFiles(chosenFiles)
                  this.inputRef.value = null
                })
              }}
            />
          </label>
        </div>
      </div>

    )
  }

  handleRemoveDocument = (pos) => () => {
    const { value, changeValue } = this.props
    const newValue = value.filter((item, i) => i !== pos)
    changeValue(newValue)
  }

  // handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

  render() {
    const { maxFiles = 100, hasError } = this.props
    return (
      <div className={classNames(classes.container, hasError && 'errorWrapper')}>
        <Dropzone
          inputContent='Kéo thả tài liệu vào đây'
          InputComponent={this.Input}
          getUploadParams={this.getUploadParams}
          multiple={true}
          getFilesFromEvent={this.getFilesFromEvent}
          PreviewComponent={null}
          maxFiles={maxFiles || 10}
          accept=".pdf,.doc,.docx,.xlsx,.xls,image/*"
        // onChangeStatus={this.handleChangeStatus}
        />
      </div>
    )
  }
}

export default renderField(DropzoneUploader)
