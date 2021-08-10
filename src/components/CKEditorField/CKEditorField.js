import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import classNames from 'classnames'
import renderField from '../../Form/renderField'
import classes from './CKEditorField.module.scss'

export class CKEditorField extends React.Component {
  render() {
    const {
      intl,
      note,
      hasError,
      placeholder,
      input
    } = this.props

    // console.log('CKEditorField', input)
    return (
      <div>
        <div className={classNames(classes.inputWrapper, hasError && 'ckeditorError')}>
          <CKEditor
            editor={ClassicEditor}
            data={input.value || ''}
            placeholder={placeholder}
            onInit={(editor) => {
              console.log('TEST', editor.setData);
              editor.setData(input.value)
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              // console.log({ event, editor, data });
              input.onChange(data)
            }}
            onBlur={(event, editor) => {
              // console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              // console.log('Focus.', editor);
            }}
            ref={(editorRef) => this.editorRef = editorRef }
          />
        </div>
        {note && <p className={classes.note}>
          {typeof note === 'string' ? note : intl.formatMessage(note)}
        </p>}
      </div>
    )
  }
}

export default renderField(CKEditorField)
