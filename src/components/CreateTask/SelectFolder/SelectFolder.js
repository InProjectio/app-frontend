import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import classes from './SelectFolder.module.scss'
import Head from '../Head'
import Input from '../Input'
import Space from './Space'
import { connect } from 'react-redux'
import { selectSpaces } from 'layout/AdminLayout/selectors'
import { createStructuredSelector } from 'reselect'

let timeout = null

const SelectFolder = ({ handleClose, SPACES, handleChangePhase }) => {
  const [text, setText] = useState('')
  const [spaces, setSpaces] = useState(SPACES)

  const handleSearch = (value) => {
    setText(value)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (value) {
        let newSpaces = []
        SPACES.forEach((space) => {
          let newProjects = []
          space.projects.forEach((project) => {
            let newPhases = project.phases.filter((phase) => phase.folder_name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
            if (newPhases.length > 0) {
              newProjects.push({
                ...project,
                phases: newPhases
              })
            }
          })
          if (newProjects.length > 0) {
            newSpaces.push({
              ...space,
              projects: newProjects
            })
          }
        })

        setSpaces(newSpaces)
       
      } else {
        setSpaces(SPACES)
      }
      
    }, 300)
    
  }

  const handleChangeSelectedPhase = (phase) => {
    handleChangePhase(phase)
    handleClose()
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='SelectFolder.members' defaultMessage='Select folder'/>}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <Input placeholder='Search phase...'
          value={text}
          onChange={handleSearch}
          autoFocus={true}
        />
        <div className={classes.spaces}>
          { spaces.map((space) => (
            <Space key={space.workspace_id} space={space} handleChangePhase={handleChangeSelectedPhase}/>
          )) }
        </div>
      </div>
      
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  SPACES: selectSpaces()
})

export default connect(mapStateToProps)(SelectFolder)
