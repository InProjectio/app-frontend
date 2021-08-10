import React, { useRef } from 'react'
import classes from './AddToCard.module.scss'
import userIcon from 'images/user.svg'
import tagIcon from 'images/tag.svg'
import checkList from 'images/check-list.svg'
import attachment from 'images/paperclip.svg'
import budgetIcon from 'images/budget.png'
import spendIcon from 'images/spend.png'
import { FormattedMessage } from 'react-intl'
import SelectMembers from '../SelectMembers'
import useShowPopup from '../hooks/useShowPopup'
import SelectLabels from '../SelectLabels'
import AddAttachment from '../AddAttachment'
import AddCheckList from '../AddCheckList'
import Budget from '../Budget'
import Spend from '../Spend'
import Dropdown from 'components/Dropdown'

const AddToCard = ({ members,
  labels,
  setMembers,
  setLabels,
  checklist,
  addChecklist,
  handleAddAttach,
  budget,
  setBudget,
  spend,
  setSpend,
  projectId,
  isEdit,
  setNumberLoadingAttachment
}) => {

  return (
    <div className={classes.container}>
      <p className={classes.title}>
        <FormattedMessage id='AddToCard.addToCard'
          defaultMessage='ADD TO CARD'
        />
      </p>
      { isEdit
        && <><Dropdown mainComponent={
          <a className={classes.btnLink}
          >
            <img src={userIcon} className={classes.icon} alt='icon' />
            <FormattedMessage id='AddToCard.members'
              defaultMessage='Memebers'
            />
          </a>
        }
          childrenComponent={(handleClose) => (
            <div className={classes.wrapper}>
              <SelectMembers selectedMembers={members}
                setSelectedMembers={setMembers}
                handleClose={handleClose}
                projectId={projectId}
              />
            </div>
          )}
        />
          <Dropdown mainComponent={
            <a className={classes.btnLink}
            >
              <img src={tagIcon} className={classes.icon} alt='icon' />
              <FormattedMessage id='AddToCard.labels'
                defaultMessage='Labels'
              />
            </a>
          }
            childrenComponent={(handleClose) => (
              <div className={classes.wrapper}>
                <SelectLabels selectedLabels={labels}
                  setSelectedLabels={setLabels}
                  handleClose={handleClose}
                />
              </div>
            )}
          />
          <Dropdown mainComponent={
            <a className={classes.btnLink}
            >
              <img src={checkList} className={classes.icon} alt='icon' />
              <FormattedMessage id='AddToCard.checklist'
                defaultMessage='Checklist'
              />
            </a>
          }
            childrenComponent={(handleClose) => (
              <div className={classes.wrapper}>
                <AddCheckList handleClose={handleClose}
                  checklist={checklist}
                  addChecklist={addChecklist}
                />
              </div>
            )}
          />

          <Dropdown mainComponent={
            <a className={classes.btnLink}
            >
              <img src={attachment} className={classes.icon} alt='icon' />
              <FormattedMessage id='AddToCard.attachment'
                defaultMessage='Attachment'
              />
            </a>
          }
            childrenComponent={(handleClose) => (
              <div className={classes.wrapper}>
                <AddAttachment handleClose={handleClose}
                  handleAddAttach={handleAddAttach}
                  setNumberLoadingAttachment={setNumberLoadingAttachment}
                />
              </div>
            )}
          />
        </>
      }

      <Dropdown mainComponent={
        <a className={classes.btnLink}
        >
          <img src={budgetIcon} className={classes.icon} alt='icon' />
          <FormattedMessage id='AddToCard.budget'
            defaultMessage='Budget'
          />
        </a>
      }
        childrenComponent={(handleClose) => (
          <div className={classes.wrapper}>
            <Budget handleClose={handleClose}
              budget={budget}
              setBudget={setBudget}
            />
          </div>
        )}
      />

      <Dropdown mainComponent={
        <a className={classes.btnLink}
        >
          <img src={spendIcon} className={classes.icon} alt='icon' />
          <FormattedMessage id='AddToCard.spend'
            defaultMessage='Spend'
          />
        </a>
      }
        childrenComponent={(handleClose) => (
          <div className={classes.wrapper}>
            <Spend handleClose={handleClose}
              spend={spend}
              setSpend={setSpend}
            />
          </div>
        )}
      />

    </div>
  )
}

export default AddToCard
