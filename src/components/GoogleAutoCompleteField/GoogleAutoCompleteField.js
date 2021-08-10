import React, { Component } from 'react'
import Autocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import classNames from 'classnames'
import classes from './GoogleAutoCompleteField.module.scss'
import { renderField } from '../../Form'

class GoogleAutoCompleteField extends Component {
  state = {
    focus: false
  }

  handleSelected = (place) => {
    // console.log(place)
  }

  componentDidMount() {
    const element = document.getElementById('react-google-places-autocomplete-input');
    element.onchange = function (e) {
    }
    element.onblur = (e) => {
      const { input } = this.props
      if (input.value.street !== e.target.value) {
        input.onChange(null)
      }
      this.setState({
        focus: false
      })
    }

    element.onfocus = () => {
      this.setState({
        focus: true
      })
    }
  }

  render() {
    const { input,
      hasError
    } = this.props
    const { focus } = this.state
    return (
      <Autocomplete
        placeholder=''
        types={['(regions)', '(geocode)']}
        initialValue={input.value ? input.value.street : ''}
        inputClassName={classNames(classes.input, hasError && classes.errorField,
          focus && classes.focus,)}
        onSelect={async (place) => {
          const result = await geocodeByAddress(place.description)
          const { lat, lng } = await getLatLng(result[0])
          // console.log(result)
          let city = ''
          let zip_code = ''
          let district = ''
          const street = place.description
          if (result[0].address_components) {
            result[0].address_components.forEach((address) => {
              if (address.types.indexOf('postal_code') !== -1) {
                zip_code = address.long_name
              }
              if (address.types.indexOf('sublocality') !== -1) {
                district = address.long_name
              }
              if (address.types.indexOf('locality') !== -1) {
                city = address.long_name
              }
            })
          }
          input.onChange({
            lat,
            lon: lng,
            city,
            zip_code,
            street,
            district
          })
        }}
        autocompletionRequest={{
          componentRestrictions: {
            country: ['vn'],
          },
        }}
      />
    )
  }
}

export default renderField(GoogleAutoCompleteField)
