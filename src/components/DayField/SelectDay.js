import React, { Component } from 'react'
import DayPicker, { DateUtils } from 'react-day-picker';
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import classes from './DayField.module.scss'
import DayPickerNavBar from './DayPickerNavBar';
import { getMobileOperatingSystem } from '../../commons/utils';

const MONTHS = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];
const WEEKDAYS_SHORT = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];

export default class SelectDay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDays: props.selectedDays || [],
      isMobile: false
    }
  }

  componentDidMount() {
    const os = getMobileOperatingSystem()
    this.setState({
      isMobile: os !== 'unknown'
    })
  }

  handleDayClick = (day, { selected }) => {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) => DateUtils.isSameDay(selectedDay, day));
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    const newSelectedDays = [...selectedDays]
    newSelectedDays.sort((a, b) => a.getTime() - b.getTime());
    this.setState({ selectedDays: newSelectedDays });
  }

  handleChangeDays = () => {
    this.props.handleChangeDays(this.state.selectedDays)
  }

  handleDeleteDay = (pos) => () => {
    this.setState((prevState) => {
      const newSelectedDays = prevState.selectedDays.filter((d, i) => i !== pos)
      return {
        ...prevState,
        selectedDays: newSelectedDays
      }
    })
  }

  render() {
    const { handleClose } = this.props
    const { selectedDays, isMobile } = this.state
    return (
      <div className={classes.selectDay}>
        <div className={classes.row}>
          <p className={classes.title}>
            <FormattedMessage id='SelectDay.title'
              defaultMessage='Select a day of class'
            />
          </p>
          <a className={classes.btnClose}
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faTimes} className={classes.closeIcon} />
          </a>
        </div>
        <div className='selectDay'>
          <DayPicker numberOfMonths={isMobile ? 1 : 2}
            pagedNavigation
            navbarElement={<DayPickerNavBar />}
            selectedDays={selectedDays}
            onDayClick={this.handleDayClick}
            months={MONTHS}
            weekdaysShort={WEEKDAYS_SHORT}
            disabledDays={{
              before: new Date(),
            }}
          />
        </div>

        <p className={classes.selectedDays}>
          <FormattedMessage id='SelectDay.selectedDays'
            defaultMessage='Selected days'
          />
        </p>

        { (selectedDays && selectedDays.length > 0)
          ? <div className={classes.days}>
            { selectedDays.map((day, i) => (
              <div className={classes.day}
                key={day}
              >
                <p className={classes.date}>
                  { moment(day).format('DD.MM.YYYY') },
                </p>
                <p className={classes.dayValue}>
                  { moment(day).format('dddd') }
                </p>
                <a className={classes.clear}
                  onClick={this.handleDeleteDay(i)}
                >
                  <FontAwesomeIcon icon={faTimes} className={classes.icon} />
                </a>
              </div>
            )) }
          </div> : <p className={classes.blank}>
            <FormattedMessage id='SelectDay.blank'
              defaultMessage='Blank'
            />
          </p>
        }

        <div className={classes.actions}>
          <a className={'btn mr15'}
            onClick={handleClose}
          >
            <FormattedMessage id='SelectDay.cancel'
              defaultMessage='Cancel'
            />
          </a>
          <a className={'btn btnBlue'}
            onClick={this.handleChangeDays}
          >
            <FormattedMessage id='SelectDay.ok'
              defaultMessage='Ok'
            />
          </a>
        </div>
      </div>
    )
  }
}
