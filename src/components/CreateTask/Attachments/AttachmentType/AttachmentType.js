import React from 'react'
import classes from './AttachmentType.module.scss'
import wordIcon from 'images/fileIcons/word.svg'
import csvIcon from 'images/fileIcons/csv.svg'
import excel from 'images/fileIcons/excel.svg'
import docIcon from 'images/fileIcons/doc.svg'
import powerpointIcon from 'images/fileIcons/powerpoint.svg'
import pptIcon from 'images/fileIcons/ppt.svg'
import txtIcon from 'images/fileIcons/txt.svg'
import xlsIcon from 'images/fileIcons/xls.svg'
import pdfIcon from 'images/fileIcons/pdf.svg'

const isImage = (fileName) => {
  return /[\/.](gif|jpg|jpeg|tiff|png|svg)$/i.test(fileName)
}

const fileType = (filename) => {
  const extend = filename ? filename.split('.').pop() : 'File';
  if (!filename) {
    return 'File'
  } else if (extend.toUpperCase() === 'DOCX') {
    return <img src={wordIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'DOC') {
    return <img src={docIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'XLS') {
    return <img src={xlsIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'XLSX') {
    return <img src={excel} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'CSV') {
    return <img src={csvIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'PPTX') {
    return <img src={powerpointIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'PPT') {
    return <img src={pptIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'TXT') {
    return <img src={txtIcon} className={classes.imageFile} alt='img' />
  } else if (extend.toUpperCase() === 'PDF') {
    return <img src={pdfIcon} className={classes.imageFile} alt='img' />
  } else {
    return extend
  }
}

const AttachmentType = ({ item }) => {
  let element = 'LINK'
  if (isImage(item.attachment_link)) {
    element = <img src={item.attachment_link} className={classes.image} alt='img' />
  } else if (item.attachment_location === 'UPLOAD') {
    element = fileType(item.attachment_name || item.fileName)
  }
  return (
    <div className={classes.attachmentType}>
      {element}
    </div>
  )
}

export default AttachmentType
