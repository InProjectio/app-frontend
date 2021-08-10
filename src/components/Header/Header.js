import React, { Component } from 'react'
import Dropdown from 'components/Dropdown'
import { FormattedMessage } from 'react-intl'
// import bellIcon from 'images/header/bell.png'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import classes from './Header.module.scss'
import MenuButton from './MenuButton'
import history from 'utils/history'
import Avatar from './Avatar'
import HeaderManageTask from './HeaderManageTask'
import HeaderNotifications from './HeaderNotifications'
import web3 from 'utils/smartContract/web3'
import smartContractUser from 'utils/smartContract/smartContractUser'
import MyWallet from './MyWallet'
import defaultAvatar from 'images/defaultAvatar.svg'
import EventEmitter from 'utils/EventEmitter'
import * as Api from 'api/api'
import Transactions from 'components/Transactions'
import * as storage from 'utils/storage'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchObj: {},
      show: '',
      currentAccount: null,
      showWallet: false,
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
    }
  }


  async componentDidMount() {
    const walletAddress = localStorage.getItem('walletAddress')
    if (web3) {

      window.ethereum.on('disconnect', () => {
        console.log('disconnect =====>')
      });
      window.ethereum.on('chainChanged', (chain) => {
        console.log('accountsChanged ===>', chain)
      });
      window.ethereum.on('networkChanged', function(networkId){
        console.log('networkChanged',networkId);
      });
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('accountsChanged ==================>', accounts)
        localStorage.setItem('walletAddress', accounts[0])
        this.setState({
          currentAccount: accounts[0]
        })
      });
      // const walletAddress = localStorage.getItem('walletAddress')
      this.setState({
        currentAccount: walletAddress
      })
    }

    EventEmitter.on('userInfo', (values) => {
      this.setState({
        userInfo: values
      })
    })
    
  }

  

  handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('companyId')
    storage.logout()
    history.push('/auth/login')
  }

  handleToogleMenu = () => {
    const {
      showMenuClass,
      handleShowMenuMobile,
      handleHideMenu,
    } = this.props
    if (showMenuClass) {
      handleHideMenu()
    } else {
      handleShowMenuMobile()
    }
  }

  signPublicKey = async (address) => {
    try {

      const { userInfo } = this.state

      if (userInfo.public_key) {
        return
      }

      const result = await smartContractUser.methods.signPublicKey(userInfo.user_id, userInfo.username, userInfo.email).send(
        {
          from: address
        }
      );
      await Api.put({
        url: '/user/update-profile',
        data: {
          public_key: result.from
        }
      })

    } catch(e) {
      console.log(e)
    }
  }
  
  handleConnectToMetaMask = async () => {
    if (window.web3) {
      const chainId = await web3.eth.getChainId()
        try {
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
            const accounts = await web3.eth.getAccounts();
            this.setState({
              currentAccount: accounts[0]
            })
            localStorage.setItem('walletAddress', accounts[0])
            return
          }
          const accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {}
                }
              ]
            });
            const newAccounts = await web3.eth.getAccounts();
            this.setState({
              currentAccount: newAccounts[0]
            })
            localStorage.setItem('walletAddress', newAccounts[0])
          } else {
            const walletAddress = await window.ethereum.request({
              method: "eth_requestAccounts",
              params: [
                {
                  eth_accounts: {}
                }
              ]
            });
            this.setState({
              currentAccount: walletAddress[0]
            })
            localStorage.setItem('walletAddress', walletAddress[0])
          }
      
        } catch(e) {
          console.log(e)
        }
      
      
    } else {
      this.props.showNotification({
        type: 'ERROR',
        message: 'Connect error please install MetaMask plugin'
      })
    }
  }

  viewWallet = () => {
    this.setState({
      showWallet: true
    })
  }

  handleCloseWallet = () => {
    this.setState({
      showWallet: false
    })
  }

  handleLogoutWallet = () => {
    this.setState({
      currentAccount: ''
    })
    localStorage.removeItem('walletAddress')
  }

  render() {
    const { 
      handleToggleMenu,
      collapse,
      showMenuClass,
      location
    } = this.props

    const { currentAccount, showWallet, userInfo } = this.state

    return (
      <div className={classes.container}>
        <div className={classNames(classes.left, collapse && classes.leftCollapse)}>
          { handleToggleMenu
            && <MenuButton handleToggleMenu={handleToggleMenu}
              active={collapse}
            />
          }

          { location.pathname.indexOf('/s-') !== -1
            && <HeaderManageTask location={location}/>
          }
          { location.pathname.indexOf('/settings/') !== -1
            && <p className={classes.title}>
              Settings
            </p>
          }
          { location.pathname.indexOf('/notifications/') !== -1
            && <HeaderNotifications location={location}/>
          }
          

          {/* <a className={classes.row}>
            <img src={viewIcon} className={classes.icon} alt='icon'/>
            <p className={classes.text}>
              <FormattedMessage id='Header.list'
                defaultMessage='View'
              />
            </p>
          </a> */}
          
        </div>
        <div className={classes.right}>
          { currentAccount
              ? <div className={classes.currentAccount}
                onClick={this.viewWallet}
              >
                {`${currentAccount.slice(0, 6)}...${currentAccount.slice(currentAccount.length - 4, currentAccount.length)}`}
              </div>
              : <div className={classes.connectToMetaMask}
                  onClick={this.handleConnectToMetaMask}
                >
                <div className={classNames(classes.status)}/>
                <p className={classes.connectToMetaMaskStatus}>
                  Connect to Web3
                </p>
              </div>
            }
          
          <div className={classes.transactions}>
            <Transactions />
          </div>
          


          <Dropdown mainComponent={
            <div className={classes.userName} >
              <p className={classes.name}>
                { userInfo.fullname || userInfo.username }
              </p>
              <Avatar avatar={userInfo.avatar_url || defaultAvatar}/>
          </div>
          }
            childrenComponent={(handleClose) => (
              <div className={classes.menus}>
                <Link className={classes.dropdownItem}
                  to='/settings/account'
                  onClick={handleClose}
                >
                  My Account
                </Link>
                <Link className={classes.dropdownItem}
                  to='/settings/change-password'
                  onClick={handleClose}  
                >
                  Change Password
                </Link>
                <div className={classes.dropdownItem}
                  onClick={this.handleLogout}
                >
                  <FormattedMessage id='Header.logout'
                    defaultMessage='Logout'
                  />
                </div>
              </div>
            )}
          />
        </div>
        <div className={classes.headerMenu}>
          <MenuButton handleToggleMenu={this.handleToogleMenu}
            active={showMenuClass}
          />
          <a className={classes.logout}
            onClick={this.handleLogout}
          >
            <FormattedMessage id='Header.logout'
              defaultMessage='Logout'
            />
          </a>
        </div>
        <MyWallet show={showWallet}
          currentAccount={currentAccount}
          handleClose={this.handleCloseWallet}
          handleLogoutWallet={this.handleLogoutWallet}
        />
      </div>
    )
  }
}
