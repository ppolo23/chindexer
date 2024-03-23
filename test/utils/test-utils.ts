import Web3 from 'web3';

export function createTransactionReceiptToAddress(toAddress: string): any {
  return {
    transactionHash: 'txHash',
    transactionIndex: 1,
    blockHash: 'hash',
    blockNumber: 1,
    from: 'address1',
    to: toAddress,
    cumulativeGasUsed: 1,
    gasUsed: 1,
    logsBloom: 'logsBloom',
    root: 'root',
    status: 1,
    logs: [
      {
        topics: [Web3.utils.keccak256('Transfer(address,address,uint256)')],
        address: toAddress,
      },
    ],
  };
}

export function createWeb3Block(
  transactionHash: string,
  toAddress: string,
): any {
  return {
    parentHash: 'parentHash',
    sha3Uncles: 'sha3Uncles',
    miner: 'miner',
    stateRoot: 'stateRoot',
    transactionsRoot: 'transactionsRoot',
    receiptsRoot: 'receiptsRoot',
    number: 1,
    gasLimit: 1,
    gasUsed: 1,
    timestamp: new Date().getTime(),
    extraData: 'extraDataType',
    mixHash: 'mixHash',
    nonce: 1,
    totalDifficulty: 1,
    size: 1,
    transactions: [
      {
        hash: transactionHash,
        to: toAddress,
      },
    ],
    uncles: 'Uncles',
    hash: 'hash',
  };
}

export function createDecodedLog(): Record<string, unknown> {
  return {
    from: 'address1',
    to: 'address2',
    value: 1000,
    __length__: 3,
  };
}
