import web3 from './web3';

const address = process.env.REACT_APP_SMART_CONTRACT_PROJECT_ADDRESS;

const abi = [{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"assignee","type":"uint256"}],"name":"addUserToProject","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"viewer_id","type":"uint256"}],"name":"addViewerToProject","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"project_name","type":"string"}],"name":"createProject","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"}],"name":"deleteProject","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"}],"name":"findProject","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListProject","outputs":[{"components":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"project_name","type":"string"},{"internalType":"string","name":"visible","type":"string"},{"internalType":"string","name":"deleted","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Project.ProjectEntity[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"}],"name":"getProjectDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"}],"name":"getProjectUserDetail","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"}],"name":"isProjectDeleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"}],"name":"isProjectVisible","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"user_in_project","type":"uint256"}],"name":"removeUserFromProject","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"project_id","type":"uint256"},{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"project_name","type":"string"},{"internalType":"string","name":"visible","type":"string"}],"name":"updateProject","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

let contract = web3 ? new web3.eth.Contract(abi, address) : null

export default contract