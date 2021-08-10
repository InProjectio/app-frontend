import React, { useState, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import classes from './Spaces.module.scss'
import SpaceItem from '../SpaceItem'
import CreateProject from '../CreateProject'
import CreateSpace from '../CreateSpace'
import CreatePhase from '../CreatePhase'
import plusIcon from 'images/sidebar/plus.png'
import { handleShowConfirm, showNotification } from 'layout/CommonLayout/actions'
import { connect } from 'react-redux'
import { convertParamsFromPathname } from 'utils/utils'
import {
  handleShowTaskForm,
  deleteSpace,
  deleteProject,
  deletePhase
} from 'layout/AdminLayout/slices'
import {
  selectSpaces
} from 'layout/AdminLayout/selectors'
import * as Api from 'api/api'
import { createStructuredSelector } from 'reselect'
import ManageMembers from '../ManageMembers'
import web3 from 'utils/smartContract/web3'
import folder from 'utils/smartContract/folder'
import smartContractSpace from 'utils/smartContract/workspace'
import smartContractProject from 'utils/smartContract/project'
// import loadingImage from 'images/loading.gif'
import classNames from 'classnames'

const Spaces = ({ handleShowConfirm, location, handleShowTaskForm, showNotification, spaces, deleteSpace,
  deleteProject,
  deletePhase,
  collapse
  }) => {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateSpace, setShowCreateSpace] = useState(false)
  const [showCreatePhase, setShowCreatePhase] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [selectedSpaceId, setSelectedSpaceId] = useState(null)
  const [selectedSpaceName, setSelectedSpaceName] = useState(null)
  const [ showMembers, setShowMembers ] = useState(false)
  const [ loadingDelete, setLoadingDelete ] = useState(false)

  const { spaceId, projectId, phaseId } = useMemo(() => {
    return convertParamsFromPathname(location.pathname)
  }, [location.pathname, location.search])


  const handleShowCreateProject = (selectedSpace, selectedProject) => {
    setSelectedProject(selectedProject)
    setSelectedSpace(selectedSpace)
    
    setShowCreateProject(true)
  }

  const handleCloseCreateProject = () => {
    setShowCreateProject(false)
  }

  const handleShowCreateSpace = (selectedSpace) => {
    setShowCreateSpace(true)
    setSelectedSpace(selectedSpace)
  }

  const handleCloseCreateSpace = () => {
    setShowCreateSpace(false)
  }

  const handleShowCreatePhase = (selectedProject, selectedPhase, spaceId, spaceName) => {
    setSelectedSpaceId(spaceId)
    setSelectedSpaceName(spaceName)
    setSelectedProject(selectedProject)
    setSelectedPhase(selectedPhase)
    setShowCreatePhase(true)
  }

  const handleCloseCreatePhase = () => {
    setShowCreatePhase(false)
  }

  const handleDeleteSpace = (space) => {
    handleShowConfirm({
      title: 'Confirm',
      description: `Do you want to delete space: '${space.workspace_name}'?`,
      handleOk: async () => {
        try {
          let transactionId;
          setLoadingDelete(true)
          const accounts = await web3.eth.getAccounts();
          const resultMetaMask = await smartContractSpace.methods.deleteWorkspace(
            space.workspace_id
          ).send(
            {
              from: accounts[0]
            }, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'DELETE',
                    summary: 'Delete space',
                    from: accounts[0]
                  }
                })
                transactionId = result.data.transaction_id
              }
            }
          );
          await Api.deleteData({
            url: `/workspace/${space.workspace_id}`,
            data: {
              txhash: resultMetaMask.transactionHash
            }
          })
          if (transactionId) {
            Api.put({
              url: '/transaction',
              data: {
                transaction_id: transactionId,
                block_hash: resultMetaMask.blockHash,
                block_number: resultMetaMask.blockNumber,
                status: resultMetaMask.status ? 1 : 0
              }
            })
          }
          showNotification({
            type: 'SUCCESS',
            message: 'Delete workspace success!'
          })
          deleteSpace(space.workspace_id)
          setLoadingDelete(false)
        } catch(e) {
          console.log(e)
          setLoadingDelete(false)
        }
        
      }
    })
  }

  const handleDeleteProject = (project, spaceId) => {
    handleShowConfirm({
      title: 'Confirm',
      description: `Do you want to delete project: '${project.project_name}'?`,
      handleOk: async () => {
        try {
          let transactionId;
          setLoadingDelete(true)
          const accounts = await web3.eth.getAccounts();
          const resultMetaMask = await smartContractProject.methods.deleteProject(
            project.project_id
          ).send(
            {
              from: accounts[0]
            }, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'DELETE',
                    summary: 'Delete project',
                    from: accounts[0]
                  }
                })
                transactionId = result.data.transaction_id
              }
            }
          );
          await Api.deleteData({
            url: `/project/${project.project_id}`,
            data: {
              txhash: resultMetaMask.transactionHash
            }
          })
          if (transactionId) {
            Api.put({
              url: '/transaction',
              data: {
                transaction_id: transactionId,
                block_hash: resultMetaMask.blockHash,
                block_number: resultMetaMask.blockNumber,
                status: resultMetaMask.status ? 1 : 0
              }
            })
          }
          showNotification({
            type: 'SUCCESS',
            message: 'Delete project success!'
          })
          deleteProject({ spaceId, projectId: project.project_id })
          setLoadingDelete(false)
        } catch(e) {
          setLoadingDelete(false)
        }
        
      }
    })
  }

  const handleDeletePhase = (phase, projectId, spaceId) => {
    handleShowConfirm({
      title: 'Confirm',
      description: `Do you want to delete phase: '${phase.folder_name}'?`,
      handleOk: async () => {
        try {
          let transactionId;
          setLoadingDelete(true)
          const accounts = await web3.eth.getAccounts();
          const resultMetaMask = await folder.methods.deleteFolder(
            phase.folder_id
          ).send(
            {
              from: accounts[0]
            }, async (error, transactionHash) => {
              if (!error) {
                const result = await Api.post({
                  url: '/transaction',
                  data: {
                    txhash: transactionHash,
                    type: 'DELETE',
                    summary: 'Delete phase',
                    from: accounts[0]
                  }
                })
                transactionId = result.data.transaction_id
              }
            }
          );
          await Api.deleteData({
            url: `/folder/${phase.folder_id}`
          })
          if (transactionId) {
            Api.put({
              url: '/transaction',
              data: {
                transaction_id: transactionId,
                block_hash: resultMetaMask.blockHash,
                block_number: resultMetaMask.blockNumber,
                status: resultMetaMask.status ? 1 : 0
              }
            })
          }
          showNotification({
            type: 'SUCCESS',
            message: 'Delete folder success!'
          })
          deletePhase({ spaceId, projectId, phaseId: phase.folder_id })
          setLoadingDelete(false)
        } catch(e) {
          setLoadingDelete(false)
        }
        
      }
    })
  }

  const handleShowMembers = ({ space, project }) => {
    setSelectedSpace(space)
    setSelectedProject(project)
    setShowMembers(true)
  }

  return (
    <div className={classNames(collapse && classes.containerCollapse)}>
      <div className={classes.rowBetween}>
        <p className={classes.spaceTitle}>
          <FormattedMessage id='SideBar.space'
            defaultMessage='SPACES'
          />
        </p>
        <a className={classes.btnAdd}
          onClick={() => handleShowCreateSpace()}
        >
          <img src={plusIcon} className={classes.plusIcon} alt='plus' />
        </a>
      </div>
      {spaces.map((space) => (
        <div className={classes.space}
          key={space.workspace_id}
        >
          <SpaceItem space={space}
            handleShowCreateProject={handleShowCreateProject}
            handleShowCreatePhase={handleShowCreatePhase}
            handleShowCreateSpace={handleShowCreateSpace}
            handleDeleteSpace={handleDeleteSpace}
            handleDeleteProject={handleDeleteProject}
            handleDeletePhase={handleDeletePhase}
            selectedSpaceId={+spaceId}
            selectedProjectId={+projectId}
            selectedPhaseId={+phaseId}
            handleShowTaskForm={handleShowTaskForm}
            handleShowMembers={handleShowMembers}
            collapse={collapse}
          />
        </div>
      ))}

      <CreateProject show={showCreateProject}
        handleClose={handleCloseCreateProject}
        initialValues={selectedProject ? {
          project_name: selectedProject.project_name,
          space: selectedSpace ? {
            value: selectedSpace.workspace_id,
            label: selectedSpace.workspace_name
          } : null,
          visible: selectedProject.visible === 'y',
          project_id: selectedProject.project_id
        } : {
          project_name: ''
        }}
        isEdit={!!selectedProject}
        spaceId={selectedSpace?.workspace_id}
        spaceName={selectedSpace?.workspace_name}
        selectedProject={selectedProject}
        selectedSpace={selectedSpace}
      />

      <CreateSpace show={showCreateSpace}
        handleClose={handleCloseCreateSpace}
        initialValues={selectedSpace ? {
          workspace_name: selectedSpace.workspace_name,
          thumbnail_url: selectedSpace.thumbnail_url && [{ url: selectedSpace.thumbnail_url, id: 1 }],
          visible: selectedSpace.visible === 'y',
          workspace_id: selectedSpace.workspace_id
        } : {}}
        isEdit={!!selectedSpace}
      />

      <CreatePhase show={showCreatePhase}
        handleClose={handleCloseCreatePhase}
        initialValues={selectedPhase ? {
          folder_name: selectedPhase.folder_name,
          project: {
            value: selectedProject?.project_id,
            label: selectedProject?.project_name
          },
          folder_id: selectedPhase.folder_id,
          visible: selectedPhase.visible === 'y',
        } : {
          folder_name: ''
        }}
        isEdit={!!selectedPhase}
        projectId={selectedProject?.project_id}
        projectName={selectedProject?.project_name}
        spaceId={selectedSpaceId}
        spaceName={selectedSpaceName}
      />

      { showMembers
        && <ManageMembers show={showMembers}
        handleClose={() => setShowMembers(false)}
        space={selectedSpace}
        project={selectedProject}
      />
      }
     
      
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  spaces: selectSpaces()
})

export default connect(mapStateToProps, {
  handleShowConfirm,
  handleShowTaskForm,
  showNotification,
  deleteSpace,
  deleteProject,
  deletePhase
})(Spaces)

