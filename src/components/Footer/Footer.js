import React from 'react'
// import classNames from 'classnames'
import instagramIcon from 'images/instagram.svg'
import facebookIcon from 'images/facebook.svg'
import youtubeIcon from 'images/youtube.svg'
// import moneyIcon from 'images/money-white.svg'
// import language from 'images/language.svg'
import classes from './Footer.module.scss'
import { FormattedMessage } from 'react-intl'


const Footer = () => {
	return (
		<div className={classes.container}>
			<div className={classes.wrapper}>
				<div className={classes.content}>
					<div className={classes.left}>
						
						{/* <a className={classes.text}>
							<FormattedMessage id='Footer.buyCar'
								defaultMessage='Mua xe'
							/>
						</a>
						<a className={classes.text}>
							<FormattedMessage id='Footer.sellCar'
								defaultMessage='Bán xe'
							/>
						</a>
						<a className={classes.text}>
							<FormattedMessage id='Footer.buyInsurance'
								defaultMessage='Mua bảo hiểm xe'
							/>
						</a>
						<a className={classes.text}>
							<FormattedMessage id='Footer.maintance'
								defaultMessage='Sửa xe, bảo dưỡng xe'
							/>
						</a>
						<a className={classes.text}>
							<FormattedMessage id='Footer.buyProduct'
								defaultMessage='Mua phụ tùng xe'
							/>
						</a> */}
					</div>
					<div className={classes.right}>
						<div className={classes.rowBetween}>
							<div className={classes.row}>
								<a className={classes.menu}>
									<FormattedMessage id='Footer.about'
										defaultMessage='VỀ CARCLICK'
									/>
								</a>
								<a className={classes.menu}>
									<FormattedMessage id='Footer.ternAndCondition'
										defaultMessage='ĐIỀU KHOẢN HOẠT ĐỘNG'
									/>
								</a>
								<a className={classes.menu}>
									<FormattedMessage id='Footer.recruitment'
										defaultMessage='TUYỂN DỤNG'
									/>
								</a>
								<a className={classes.menu}>
									<FormattedMessage id='Footer.contact'
										defaultMessage='LIÊN HỆ'
									/>
								</a>
							</div>
							{/* <div className={classNames(classes.row, classes.langs)}>
								<div className={classNames(classes.row, classes.mr20)}>
									<img src={language} alt='language' className={classes.language} />
									<span> Tiếng Việt </span>
								</div>
								<div className={classes.row}>
									<img src={moneyIcon} alt='language' className={classes.moneyIcon} />
									<span> VNĐ </span>
								</div>
							</div> */}

						<div className={classes.socials}>	
							<img src={facebookIcon} className={classes.icon} alt='icon'/>
							<img src={instagramIcon} className={classes.icon} alt='icon'/>
							<img src={youtubeIcon} className={classes.icon} alt='icon'/>
						</div>
						</div>
					</div>
				</div>
				<div className={classes.copyRight}>
					@ 2020 CarClick. Bản quyền thuộc về Công ty TNHH CarClick Việt Nam. MSDN: 0123456789. Tòa nhà 210 tòa nhà Capital Tower số 291 Trung Kính, Cầu Giấy, Hà Nội
				</div>
			</div>
		</div>
	)
}

export default Footer