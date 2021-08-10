import React from 'react'
import notFoundImage from 'images/404.svg'
import { Link } from 'react-router-dom'
import classes from './NotFound.module.scss'

const NotFound = () => (
  <div className={classes.container}>
    <img src={notFoundImage} className={classes.image} alt='img'/>
    <p className={classes.title}>
      Xin lỗi!
    </p>
    <p className={classes.description}>
      Chúng tôi không tìm thấy trang của bạn đang tìm kiếm
    </p>
    <div className={classes.actions}>
      <Link className='btn btnPurple'
        to='/'
      >
        Trang chủ
      </Link>
    </div>
    
  </div>
)

export default NotFound
