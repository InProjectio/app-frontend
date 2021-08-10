import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import classes from './SearchComponent.module.scss'

export default class SearchComponent extends Component {
  handleChange = (e) => {
    const { handleChange } = this.props
    const { value } = e.target
    handleChange(value)
  }

  handleSearch = () => {
    this.props.handleSearch(this.props.value)
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.handleSearch(this.props.value)
    }
  }

  render() {
    const { btnClass, placeholder, value, customClass } = this.props
    return (
      <div className={classNames(classes.container, customClass)}>
        <input className={classNames(classes.input)}
          type='text'
          value={value || ''}
          placeholder={placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <a className={classNames(classes.btnSearch, btnClass)}
          onClick={this.handleSearch}
        >
          <FontAwesomeIcon icon={faSearch}
            className={classes.icon}
          />
        </a>
      </div>
    )
  }
}
