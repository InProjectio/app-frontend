import React, { useRef } from 'react'
import classes from './Labels.module.scss'
import { FormattedMessage } from 'react-intl'
import plusIcon from 'images/plus-black.svg'
import useShowPopup from '../hooks/useShowPopup'
import SelectLabels from '../SelectLabels'

const Labels = ({ labels, setLabels }) => {
  const wrapperRef = useRef(null)
  const [showSelectLabel, setShowSelectLabel] = useShowPopup(wrapperRef)
  return (
    <div className={classes.container}>
      <p className={classes.title}>
        <FormattedMessage id='Labels.title'
          defaultMessage='Labels'
        />
      </p>
      <div className={classes.row}
      >
        { labels.map((label, i) => (
          <div className={classes.label}
            style={{
              backgroundColor: label.label_color
            }}
            onClick={() => setShowSelectLabel(true)}
            key={label._id}
          >
            { label.label_name }
          </div>
        )) }

        <a className={classes.btnAdd}
          onClick={() => setShowSelectLabel(true)}
        >
          <img src={plusIcon} className={classes.plusIcon} alt='icon'/>
        </a>
      </div>

      { showSelectLabel
        && <div className={classes.selectLabels}>
          <SelectLabels selectedLabels={labels}
            setSelectedLabels={setLabels}
            handleClose={() => setShowSelectLabel(false)}
          />
      </div>
      }
      
     
    </div>
  )
}

export default Labels
