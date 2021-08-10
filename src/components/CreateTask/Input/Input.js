import React, { useRef, useEffect } from 'react'
import classes from './Input.module.scss'

const Input = ({ value, onChange, placeholder, autoFocus, onBlur }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <input className={classes.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      ref={inputRef}
      onBlur={onBlur}
    />
  )
}

export default Input

