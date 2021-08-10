import web3 from './web3';

const address = process.env.REACT_APP_SMART_CONTRACT_WORKSPACE_ADDRESS;

const abi = [{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"uint256","name":"assignee","type":"uint256"}],"name":"addUserToWorkspace","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"uint256","name":"viewer_id","type":"uint256"}],"name":"addViewerToWorkspace","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"workspace_name","type":"string"},{"internalType":"string","name":"thumbnail_url","type":"string"}],"name":"createWorkspace","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"}],"name":"deleteWorkspace","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"}],"name":"findWorkspace","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListWorkspace","outputs":[{"components":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"workspace_name","type":"string"},{"internalType":"string","name":"thumbnail_url","type":"string"},{"internalType":"string","name":"visible","type":"string"},{"internalType":"string","name":"deleted","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Workspace.WorkspaceEntity[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListWorkspaceUser","outputs":[{"components":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"},{"internalType":"string","name":"role","type":"string"},{"internalType":"string","name":"is_owner","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Workspace.WorkspaceUser[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"}],"name":"getWorkspaceDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"}],"name":"getWorkspaceUserDetail","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"}],"name":"isWorkspaceDeleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"}],"name":"isWorkspaceVisible","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"uint256","name":"user_in_workspace","type":"uint256"}],"name":"removeUserFromWorkspace","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"workspace_id","type":"uint256"},{"internalType":"string","name":"workspace_name","type":"string"},{"internalType":"string","name":"thumbnail_url","type":"string"},{"internalType":"string","name":"visible","type":"string"}],"name":"updateWorkspace","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

let contract = web3 ? new web3.eth.Contract(abi, address) : null

export default contract