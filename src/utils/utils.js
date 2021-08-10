import writtenNumber from 'written-number'
import web3 from './smartContract/web3'
import moment from 'moment'
import history from 'utils/history'

export const convertObjectToSearchParams = (values) => {
  if (values) {
    // console.log(values)
    const search = Object.entries(values).filter(([key, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')
    return `?${search}`
  }
  return ''
}

export const convertSearchParamsToObject = (search) => {
  if (search) {
    const value = search.slice(1)
    let obj = {}
    value.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      obj[key] = value
    });
    return obj
  }
  return {}
}


export const isLoggedIn = () => !!localStorage.getItem('accessToken')

export const notCustomer = () => localStorage.getItem('roles') !== 'CUSTOMER'

export function getWrittenNumber(availAmount, { lang = 'vi' }) {
  let str = writtenNumber(availAmount, { lang })
  if (!str) {
    return ''
  }
  str = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  return `${str.replace(new RegExp('và ', 'g'), '')} đồng`
}

export function formatStringToNumber(value, isComma = true) {
  if (!value && value !== 0) {
    return '-'
  }
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })

  return formatter.format(value).replace(/,/g, isComma ? ',' : '.')
}

export function displayPrice(price) {
  if (price > 1000000000) {
    return `${price / 1000000000} Tỉ`
  } else {
    return `${price / 1000000} Triệu`
  }
}

export const deleteAccents = (inputStr) => {
  let str = inputStr
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

export const generateCode = (text) => {
  const removeAccents = deleteAccents(text)

  return removeAccents.replaceAll(' ', '_')
}

function text2Link(text) {
  const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim
  const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim
  const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim
  return text
    .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
    .replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>')
}

export function text2HTML(text) {
  if (!text) {
    return ''
  }

  text = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  text = text2Link(text)
  text = text.replace(/\r\n?|\n/g, ' <br> ')
    .replace(/<br>\s*<br>/g, '</p><p>')
  text = `<span>${text}</span>`
  return text
}

export const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

export const checkMetaMask = (showNotification, handleClose) => {
  if (!web3) {
    showNotification({
      type: 'ERROR',
      message: 'Please install MetaMask plugin'
    })
    return false
  }
  let walletAddress = localStorage.getItem('walletAddress')
  if (!walletAddress) {
    showNotification({
      type: 'ERROR',
      message: 'Please connect with MetaMask first'
    })
    return false
  }
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
  if (!userInfo.public_key) {
    showNotification({
      type: 'ERROR',
      message: 'Please connect with MetaMask first'
    })
    if (handleClose) {
      handleClose()
    }
    history.push('/settings/account')
    return false
  }
  if (userInfo.public_key.toLowerCase() !== walletAddress.toLowerCase()) {
    showNotification({
      type: 'ERROR',
      message: 'Account and Metamask not match'
    })
    return false
  }

  return true
}

export const checkChainId = async () => {
  try {
    const chainId = await web3.eth.getChainId()
    if (chainId !== 97) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
        chainId: '0x61',
        chainName: 'Inproject',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/']
        }]
      })
      return true
    }
  } catch(e) {
    return Promise.reject(e)
  }
  
}


export const convertParamsData = (params) => {
  const spaceId = params.space && params.space.split('-').slice(-1)[0]
  const projectId = params.project && params.project.split('-').slice(-1)[0]
  const phaseId = params.phase && params.phase.split('-').slice(-1)[0]
  return {
    spaceId,
    projectId,
    phaseId
  }
}

const convertIdAndName = (value) => {
  if (!value) {
    return []
  }
  const arr = value.split('-')
  const numberArray = arr.length
  const id = arr[numberArray - 1]
  const name = arr.slice(1, numberArray - 1).join(' ')
  return [id, name]
}

export const convertParamsFromPathname = (pathname) => {
  const stringValue = pathname || location.pathname
  if (stringValue.indexOf('s-') === -1) {
    return {}
  }
  const [space, project, phase, task] = stringValue.split('/').slice(1)
  const [spaceId, spaceName] = convertIdAndName(space)
  const [projectId, projectName] = convertIdAndName(project)
  const [phaseId, phaseName] = convertIdAndName(phase)
  const [taskId, taskName] = convertIdAndName(task)
  return {
    spaceId,
    spaceName,
    projectId,
    projectName,
    phaseId,
    phaseName,
    taskId,
    taskName
  }
}

export const spacePath = (space) => `/s-${space.workspace_name.trim().replaceAll(' ', '-').toLowerCase()}-${space.workspace_id}`

export const projectPath = (project) => `/s-${project.project_name.trim().replaceAll(' ', '-').toLowerCase()}-${project.project_id}`

export const phasePath = (phase) => `/s-${phase.folder_name.trim().replaceAll(' ', '-').toLowerCase()}-${phase.folder_id}`

export const convertFromIdToDate = (id) => {
  switch(id) {
    case 'overdue':
      return moment().add(-1, 'days').format('YYYY-MM-DD')
    case 'today':
      return moment().format('YYYY-MM-DD')
    case 'tomorrow':
      return moment().add(1, 'days').format('YYYY-MM-DD')
    case 'day2':
      return moment().add(2, 'days').format('YYYY-MM-DD')
    case 'day3':
      return moment().add(3, 'days').format('YYYY-MM-DD')
    case 'day4':
      return moment().add(4, 'days').format('YYYY-MM-DD')
    case 'day5':
      return moment().add(5, 'days').format('YYYY-MM-DD')
    case 'day6':
      return moment().add(6, 'days').format('YYYY-MM-DD')
    case 'future':
      return ''
    case 'done':
      return ''
    default:
      return ''
  }
}