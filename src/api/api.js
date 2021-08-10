import axios from 'axios'
import {
  API_URL,
  SERVICE_URL,
  API_TIMEOUT
} from '../utils/config'
import store from '../redux/configureStore'
import { showNotification } from '../layout/CommonLayout/actions'
import history from 'utils/history'
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT,
})

const handleError = async (error, hideError) => {
  const hideErrorNoti = hideError
  const lang = 'en'
  const errorMessages = {
    golobal: {
      en: 'System is in maintenance. We are on it. Please check back in a few minute.',
      vi: 'Có lỗi xảy ra, vui lòng thử lại sau'
    },
    timeout: {
      en: 'Request is timeout, check internet connection',
      vi: 'Yêu cầu của bạn bị hết hạn. Vui lòng kiểm tra kết nối'
    },
    sessionExprire: {
      en: 'Session is expried, please re-login again',
      vi: 'Vui lòng đăng nhập để sử dụng tính năng này'
    }
  }
  let errorMessage = errorMessages.golobal[lang]
  if (error.response && error.response.data && error.response.data.meta
    && error.response.data.meta.message && typeof error.response.data.meta.message === 'string'
  ) {
    errorMessage = error.response.data.meta.message
  } else if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message
  }
  if (error.code === 'ECONNABORTED') {
    errorMessage = errorMessages.timeout[lang]
  }
  if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.data.code === 401)) {
    errorMessage = errorMessages.sessionExprire[lang]
    localStorage.clear()
    history.push(`/auth/login`)
  }
  if (!hideErrorNoti) {
    store.dispatch(showNotification({
      type: 'ERROR',
      message: errorMessage
    }))
  }

  return Promise.reject(error.response, errorMessage)
}

const sendRequest = async ({ url, method, params, data, headers, options, hideError,
  isServer, config, accessToken = '' }) => {
  let access_token = accessToken || localStorage.getItem('accessToken')
  const lang = 'en' // language
  return instance({
    url,
    method,
    params: {
      // lang: lang,
      ...params,
      // user_token: access_token || '',
      textSearch: params?.textSearch ? decodeURI(params.textSearch) : undefined
    },
    data,
    config,
    headers: {
      lang: lang,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: access_token ? `Bearer ${access_token}` : '',
      'x-csrf-token': Cookies.get('csrftoken'),
      'user-token': access_token || '',
      ...headers
    },
    ...options
  }).then((response) => response.data)
    .catch((error) => handleError(error, hideError, () => sendRequest({ url,
      method,
      params,
      data,
      headers,
      options,
      hideError,
      isServer,
      config
    })))
}

export const get = ({ url, params, loading = true, headers = {}, options, hideError,
  isServer }) => (
  sendRequest({ url, params, method: 'GET', loading, headers, options, hideError, isServer })
)

export const post = ({ url, params, data, loading = true, headers = {}, options, hideError,
  config, accessToken }) => (
  sendRequest({ url, params, data, method: 'POST', loading, headers, options, config, hideError, accessToken })
)

export const put = ({ url, params, data, loading = true, headers = {}, options, accessToken }) => (
  sendRequest({ url, params, data, method: 'PUT', loading, headers, options, accessToken })
)

export const patch = ({ url, params, data, loading = true, headers = {}, options }) => (
  sendRequest({ url, params, data, method: 'PATCH', loading, headers, options })
)

export const deleteData = ({ url, params, data, loading = true, headers = {}, options }) => (
  sendRequest({ url, params, data, method: 'DELETE', loading, headers, options })
)

export const getHTTPMethod = (baseURL) => ({
  get: ({ url, params, loading, headers, options = {}, hideError }) => (
    sendRequest({ url,
      params,
      method: 'GET',
      loading,
      headers,
      options: { ...options, baseURL },
      hideError,
    })
  ),
  post: ({ url, params, data, loading = true, headers = {}, options = {}, hideError }) => (
    sendRequest({ url,
      params,
      data,
      method: 'POST',
      loading,
      headers,
      options: { ...options, baseURL },
      hideError,
    })
  ),
  put: ({ url, params, data, loading = true, headers = {}, options = {} }) => (
    sendRequest({ url,
      params,
      data,
      method: 'PUT',
      loading,
      headers,
      options: { ...options, baseURL },
    })
  ),
  deleteData: ({ url, params, data, loading = true, headers = {}, options = {} }) => (
    sendRequest({ url,
      params,
      data,
      method: 'DELETE',
      loading,
      headers,
      options: { ...options, baseURL },
    })
  ),
})

export const service = getHTTPMethod(SERVICE_URL)