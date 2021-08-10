import web3 from './web3';

const address = process.env.REACT_APP_SMART_CONTRACT_ACTIVITY_ADDRESS;

const abi = [{"inputs":[{"internalType":"address","name":"_user_contract","type":"address"},{"internalType":"address","name":"_task_contract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"string","name":"activity_content","type":"string"}],"name":"createActivity","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"}],"name":"deleteActivity","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"string","name":"emoji","type":"string"}],"name":"emojiUser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"emojis","outputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"},{"internalType":"string","name":"emoji","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"}],"name":"findActivity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"}],"name":"getActivityDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListAcitity","outputs":[{"components":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"},{"internalType":"string","name":"activity_content","type":"string"},{"internalType":"string","name":"deleted","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Activity.ActivityEntity[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"}],"name":"isActivityDeleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"string","name":"emoji","type":"string"}],"name":"removeEmoji","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"activity_id","type":"uint256"},{"internalType":"string","name":"activity_content","type":"string"}],"name":"updateActivity","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

let contract = web3 ? new web3.eth.Contract(abi, address) : null

export default contract