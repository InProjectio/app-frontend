import React, { useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import classes from './ChecklistItem.module.scss'
import checklistIcon from 'images/check-list.svg'
import Progress from '../Progress'
import Item from '../Item'
import EnterItem from '../EnterItem'
import useShowPopup from '../../hooks/useShowPopup'
import PopupConfirm from '../PopupConfirm'

const ChecklistItem = ({
  item,
  handleSaveCheckList,
  handleCreateItem,
  handleUpdateItem,
  handleDeleteChecklist,
  handleDeleteItem,
  projectId
}) => {
  const deleteRef = useRef(null)
  const [isAddItem, setIsAddItem] = useState(false)

  const [ isEditTitle, setIsEditTitle ] = useState(false)
  const [ showConfirmPopup, setShowConfirmPopup ] = useShowPopup(deleteRef)

  const items = useMemo(() => {
    return item.show_checked_item === 'y' ? item.items : item.items.filter((ite) => ite.completed !== 'y')
  }, [item.show_checked_item, item.items])

  return (
    <div className={classes.checklist}>
      <div className={classes.row}>
        <img src={checklistIcon}
          className={classNames(classes.checklistIcon)}
          alt='checklist'
        />
        <div className={classNames(classes.titleWrapper,
          !item.checklist_id && classes.titleWrapperWithoutChecklist
        )}
        >
          {isEditTitle
            ? <EnterItem handleClose={() => setIsEditTitle(false)}
              item={{...item, title: item.checklist_title}}
              handleSaveItem={handleSaveCheckList}
            />
            : <p className={classes.title}
              onClick={() => setIsEditTitle(true)}
            >
              {item.checklist_title}
            </p>
          }
        </div>

        <div className={classes.deleteWrapper}
          ref={deleteRef}
        >
          { item.checklist_id
              && <>
              <a className={classNames(classes.btn, classes.mr10)}
                onClick={() => handleSaveCheckList({...item, show_checked_item: item.show_checked_item === 'y' ? 'n' : 'y'})}
              >
                { item.show_checked_item === 'y'
                  ? <FormattedMessage id='hideCheckedItem'
                    defaultMessage='Hide checked items'
                  /> : <FormattedMessage id='showCheckedItem'
                    defaultMessage='Show checked items'
                  />
                }
                
              </a>
              <a className={classes.btn}
                onClick={() => setShowConfirmPopup(true)}
              >
                <FormattedMessage id='delete'
                  defaultMessage='Delete'
                />
              </a>
            </>
           }
          
          { showConfirmPopup
            && <div className={classes.popup}>
              <PopupConfirm title={<FormattedMessage id='deleteCheckList'
                defaultMessage='Delete {checklist}'
                values={{
                  checklist: item.checklist_title
                }}
              />}
              message={<FormattedMessage id='deleteChecklist.message'
                defaultMessage='Deleting a checklist is permanent and there is no way to get it back.'
              />}
              btnText={
                <FormattedMessage id='deleteChecklist.btn'
                defaultMessage='Delete checklist'
              />
              }
              handleClose={() => setShowConfirmPopup(false)}
              handleClick={() => handleDeleteChecklist(item)}
              
              />
            </div>
          }
          
        </div>

      </div>
      <Progress percent={item.items?.length > 0 ? ((item.numberComplete || 0) / item.items?.length) * 100 : 0} />
      { item.checklist_id && items.map((checklistItem, i) => (
        <div className={classes.checklistItem}
          key={checklistItem.item_id || checklistItem.tempId}
        >
          <Item item={checklistItem} handleUpdateItem={(values) => handleUpdateItem(item, values)}
            handleDeleteItem={(values) => handleDeleteItem(item, values)}
            projectId={projectId}
          />
        </div>
      ))}
      { item.checklist_id
        && <div className={classes.actions}>
          {isAddItem
            ? <EnterItem handleClose={() => setIsAddItem(false)}
              moreAction={true}
              handleSaveItem={(values) => handleCreateItem(item, values)}
              projectId={projectId}
            />
            : <a className={classes.btn}
              onClick={() => setIsAddItem(true)}
            >
              <FormattedMessage id='addAnItem' defaultMessage='Add an item' />
            </a>
          }
        </div>
      }
      

    </div>
  )
}

export default ChecklistItem
