import web3 from './web3';

const address = process.env.REACT_APP_SMART_CONTRACT_FOLDER_ADDRESS;

const abi = [{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"string","name":"folder_name","type":"string"}],"name":"createFolder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"deleteFolder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"findFolder","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"getFolderDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListFolder","outputs":[{"components":[{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"string","name":"folder_name","type":"string"},{"internalType":"string","name":"visible","type":"string"},{"internalType":"string","name":"deleted","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Folder.FolderEntity[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"getProjectIdOfFolder","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"isFolderDeleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"isFolderVisible","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"string","name":"folder_name","type":"string"},{"internalType":"string","name":"visible","type":"string"}],"name":"updateFolder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

let contract = web3 ? new web3.eth.Contract(abi, address) : null

export default contract
