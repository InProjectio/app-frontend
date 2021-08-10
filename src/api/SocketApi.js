import io from 'socket.io-client'
import { CHAT_SOCKET, SOCKET_PATH } from 'utils/config'

class SocketApi {
  socket = null

  connectChat = () => {
    const accessToken = localStorage.getItem('accessToken')
    const idCustomer = localStorage.getItem('idCustomer')
    this.socket = io(CHAT_SOCKET, {
      query: {
        token: accessToken,
        guid: idCustomer
      },
      path: SOCKET_PATH
    })
  }

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  on = (key, callback) => {
    this.socket.on(key, (data) => {
      callback(data)
    })
  }

  emit = (key, data) => {
    this.socket.emit(key, data)
  }
}

export default new SocketApi()
