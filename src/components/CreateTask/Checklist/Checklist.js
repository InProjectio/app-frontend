import React from 'react'
import classes from './Checklist.module.scss'
import ChecklistItem from './ChecklistItem'

const Checklist = ({ checklist, updateChecklist, updateChecklistItem, projectId }) => {
  const handleSaveCheckList = (item) => {
    const newItem = {...item, checklist_title: item.title || item.checklist_title}
    const newCheckList = checklist.map((checklistItem) => checklistItem.checklist_id === item.checklist_id ? newItem : checklistItem)
    updateChecklist(newCheckList, false, newItem)
  }

  const handleCreateItem = (listItem, item) => {
    const tempId = new Date().valueOf()
    const newCheckList = checklist.map((checklistItem) => (
      checklistItem.checklist_id === listItem.checklist_id ? {...listItem, items: [...listItem.items, { item_name: item.title, tempId }]} : checklistItem
    ))
    updateChecklistItem(newCheckList, false, listItem, {
      item_name: item.title, tempId
    })
  }

  const handleUpdateItem = (listItem, item) => {
    const newCheckList = checklist.map((checklistItem) => {
      if (checklistItem.checklist_id === listItem.checklist_id) {
        let numberComplete = 0
        const newItems = checklistItem.items.map((ite) => {
          if ((ite.item_id === item.item_id && item.completed === 'y')
            || (ite.item_id !== item.item_id && ite.completed === 'y')) {
            numberComplete += 1
          }
          return ite.item_id === item.item_id ? item : ite
        })
        return {
          ...checklistItem,
          items: newItems,
          numberComplete
        }
      }
      return checklistItem
    })
    updateChecklistItem(newCheckList, false, listItem, item)
  }

  const handleDeleteItem = (listItem, item) => {
    let itemIndex = 0
    const newCheckList = checklist.map((checklistItem) => {
      if (checklistItem.checklist_id === listItem.checklist_id) {
        const newItems = checklistItem.items.filter((ite, i) => {
          if (ite.item_id === item.item_id) {
            itemIndex = i
          }
          return ite.item_id !== item.item_id
        })
        return {
          ...checklistItem,
          items: newItems,
        }
      }
      return checklistItem
    })
    updateChecklistItem(newCheckList, true, listItem, item, itemIndex)
  }

  const handleDeleteChecklist = (checklistItem) => {
    const newChecklist = checklist.filter((item) => item.checklist_id !== checklistItem.checklist_id)
    updateChecklist(newChecklist, true, checklistItem)
  }

  return (
    <div className={classes.container}>
      { checklist && checklist.map((item, i) => (
        <ChecklistItem item={item}
          handleSaveCheckList={handleSaveCheckList}
          handleCreateItem={handleCreateItem}
          handleUpdateItem={handleUpdateItem}
          key={item.checklist_id || item.tempId}
          handleDeleteChecklist={handleDeleteChecklist}
          handleDeleteItem={handleDeleteItem}
          projectId={projectId}
        />
      )) }
      
    </div>
  )
}

export default Checklist

