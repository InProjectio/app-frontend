import * as Api from 'api/api'

export const addTransaction = ({from, type, summary}) => async (error, transactionHash) => {
  if (!error) {
    const result = await Api.post({
      url: '/transaction',
      data: {
        txhash: transactionHash,
        type,
        summary,
        from
      }
    })
    return result.data.transaction_id
  }
}