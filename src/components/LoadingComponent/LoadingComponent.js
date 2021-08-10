import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
import Loader from 'react-loader-spinner'
import classes from './LoadingComponent.module.scss'

export default class LoadingComponent extends Component {
  render() {
    const { loading, children } = this.props
    return (
      <div className={classes.container}>
        { loading
          ? <div className={classes.loader}>
            <Loader type="Oval" color='rgba(31, 125, 161, 0.5)' height={40} width={40} />
          </div>
          : <React.Fragment>
            <Fade>
              { children }
            </Fade>
          </React.Fragment>
        }
      </div>
    )
  }
}
