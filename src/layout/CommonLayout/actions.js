import {
  SHOW_CONFIRM,
  HIDE_CONFIRM,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  GET_BRANDS,
  GET_BRANDS_SUCCESS,
  GET_CAR_NAMES,
  GET_CAR_NAMES_SUCCESS,
  GET_CITIES,
  GET_CITIES_SUCCESS,
  HIDE_LOADING_BRANDS,
  HIDE_LOADING_CAR_NAMES,
  HIDE_LOADING_CITIES,
  GET_BOOKMARK_IDS,
  GET_BOOKMARK_IDS_SUCCESS,
  ADD_BOOMARK,
  ADD_BOOMARK_SUCCESS,
  GET_TOKEN,
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  SET_PROFILE,
  CLEAR_DATA
} from './constants'

export const clearData = () => {
  return {
    type: CLEAR_DATA
  }
}

export const setProfile = (profile) => {
  return {
    type: SET_PROFILE,
    profile
  }
}

export const getProfile = () => {
  return {
    type: GET_PROFILE
  }
}

export const getProfileSuccess = (profile) => {
  return {
    type: GET_PROFILE_SUCCESS,
    profile
  }
}

export const getToken = () => {
  return {
    type: GET_TOKEN
  }
}

export const getBookMarkIds = () => {
  return {
    type: GET_BOOKMARK_IDS
  }
}

export const getBookMarkIdsSuccess = (bookMarkIds) => {
  return {
    type: GET_BOOKMARK_IDS_SUCCESS,
    bookMarkIds
  }
}

export const addBookMark = (data, productType) => {
  return {
    type: ADD_BOOMARK,
    data,
    productType
  }
}

export const addBookMarkSuccess = (data) => {
  return {
    type: ADD_BOOMARK_SUCCESS,
    data
  }
}

export const showNotification = (notification) => {
  return {
    type: SHOW_NOTIFICATION,
    notification
  }
}

export const hideNotification = () => {
  return {
    type: HIDE_NOTIFICATION
  }
}

export const handleShowConfirm = (confirm) => {
  console.log('showConfirm', confirm)
  return {
    type: SHOW_CONFIRM,
    confirm
  }
}

export const handleHideConfirm = () => {
  return {
    type: HIDE_CONFIRM
  }
}

export const getBrands = () => {
  return {
    type: GET_BRANDS
  }
}

export const getBrandsSuccess = (brands, brandObj) => {
  return {
    type: GET_BRANDS_SUCCESS,
    brands,
    brandObj
  }
}

export const getCarNames = (brandId) => {
  return {
    type: GET_CAR_NAMES,
    brandId
  }
}

export const getCarNamesSuccess = (carNames, carNameObj) => {
  return {
    type: GET_CAR_NAMES_SUCCESS,
    carNames,
    carNameObj
  }
}

export const getCities = () => {
  return {
    type: GET_CITIES,
  }
}

export const getCitiesSuccess = (cities, cityObj) => {
  return {
    type: GET_CITIES_SUCCESS,
    cities,
    cityObj
  }
}

export const hideLoadingBrands = () => {
  return {
    type: HIDE_LOADING_BRANDS,
  }
}

export const hideLoadingCities = () => {
  return {
    type: HIDE_LOADING_CITIES,
  }
}

export const hideLoadingCarNames = () => {
  return {
    type: HIDE_LOADING_CAR_NAMES,
  }
}