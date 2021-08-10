import web3 from './web3';

const address = process.env.REACT_APP_SMART_CONTRACT_TASK_ADDRESS;

const abi = [{"inputs":[{"internalType":"address","name":"_user_contract","type":"address"},{"internalType":"address","name":"_folder_contract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"assignee","type":"uint256"}],"name":"addUserToTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"viewer_id","type":"uint256"}],"name":"addViewerToTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"string","name":"task_name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"start_date","type":"uint256"},{"internalType":"uint256","name":"end_date","type":"uint256"},{"internalType":"uint256","name":"estimate","type":"uint256"},{"internalType":"uint256","name":"duedate_reminder","type":"uint256"},{"internalType":"uint256","name":"budget","type":"uint256"},{"internalType":"uint256","name":"spend","type":"uint256"}],"name":"createTask","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"deleteTask","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"findTask","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"getFolderIdOfTask","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListTask","outputs":[{"components":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"string","name":"task_name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"status","type":"string"},{"internalType":"string","name":"cover_img_url","type":"string"},{"internalType":"string","name":"deleted","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Task.TaskEntity[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListTaskPlus","outputs":[{"components":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"order","type":"uint256"},{"internalType":"uint256","name":"start_date","type":"uint256"},{"internalType":"uint256","name":"end_date","type":"uint256"},{"internalType":"uint256","name":"estimate","type":"uint256"},{"internalType":"uint256","name":"duedate_reminder","type":"uint256"},{"internalType":"uint256","name":"budget","type":"uint256"},{"internalType":"uint256","name":"spend","type":"uint256"}],"internalType":"struct Task.TaskPlus[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListTaskUser","outputs":[{"components":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"},{"internalType":"string","name":"role","type":"string"},{"internalType":"string","name":"is_owner","type":"string"},{"internalType":"string","name":"watch","type":"string"},{"internalType":"uint256","name":"create_at","type":"uint256"},{"internalType":"uint256","name":"update_at","type":"uint256"}],"internalType":"struct Task.TaskUser[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"getTaskDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"getTaskPlusDetailById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"user_id","type":"uint256"}],"name":"getTaskUserDetail","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"isTaskDeleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"}],"name":"removeAllMemberInTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"user_in_task","type":"uint256"}],"name":"removeUserFromTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"budget","type":"uint256"}],"name":"updateBudget","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"string","name":"cover_img_url","type":"string"}],"name":"updateCoverImg","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"updateDescription","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"duedate_reminder","type":"uint256"}],"name":"updateDueDateReminder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"end_date","type":"uint256"},{"internalType":"uint256","name":"duedate_reminder","type":"uint256"}],"name":"updateEndDate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"estimate","type":"uint256"}],"name":"updateEstimate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"folder_id","type":"uint256"}],"name":"updateFolder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"order","type":"uint256"}],"name":"updateOrder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"spend","type":"uint256"}],"name":"updateSpend","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"start_date","type":"uint256"}],"name":"updateStartDate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"string","name":"status","type":"string"}],"name":"updateStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"uint256","name":"folder_id","type":"uint256"},{"internalType":"string","name":"status","type":"string"}],"name":"updateStatusAndFolderId","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"task_id","type":"uint256"},{"internalType":"string","name":"task_name","type":"string"}],"name":"updateTaskName","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]


let contract = web3 ? new web3.eth.Contract(abi, address) : null;

export default contract