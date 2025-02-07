import {
    GetContractReturnType,
    BlockTag,
    GetContractEventsParameters,
    PublicClient,
    WalletClient,
    Address,
    Abi,
    ContractEventArgs,
    ContractEventName,
    BlockNumber,
    Hex,
    Account,
    Chain
  } from 'viem';

export interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

export interface IClientConfig {
    chainId: number,
    rpcUrl?: string | undefined,
    logLevel?: string | undefined
    logPath?: string | undefined
}

export interface IClients {
    public: PublicClient,
    wallet: WalletClient
}

export interface ITonStakingContracts {
    TON: GetContractReturnType,
    WTON: GetContractReturnType,
    Layer2Registry: GetContractReturnType,
    DepositManager: GetContractReturnType,
    SeigManager: GetContractReturnType,
    SwapProxy: GetContractReturnType,
    DAOCommittee : GetContractReturnType,
    DAOAgendaManager: GetContractReturnType,
}

export interface ITonStakingContractAddresses {
    TON: Address,
    WTON: Address,
    Layer2Registry: Address,
    DepositManager: Address,
    SeigManager: Address,
    SwapProxy: Address,
    DAOCommittee : Address,
    DAOAgendaManager: Address,
}

export interface ITonStakingContractAbi {
    TON: Abi,
    WTON: Abi,
    Layer2Registry: Abi,
    DepositManager: Abi,
    SeigManager: Abi,
    DAOCommittee : Abi,
    DAOAgendaManager: Abi,
    Proxy: Abi,
    AutoRefactorCoinage: Abi,
    Candidate: Abi,
}

export interface IReadContractParameters {
    contract: GetContractReturnType,
    functionName: string,
    args: Array<any> | undefined
}

export interface IGetContractEventsParameters {
    contract: GetContractReturnType,
    args: ContractEventArgs | undefined,
    eventName: ContractEventName<Abi> | string | undefined,
    strict: boolean | undefined,
    fromBlock: BlockNumber | BlockTag | string | undefined,
    toBlock: BlockNumber | BlockTag | undefined,
}

export interface IGetStorageAtParameters {
    address: Address,
    slot: Hex,
    blockNumber?: undefined
    blockTag?: BlockTag | undefined
}

export interface ISimulateContractParameters {
    contract: GetContractReturnType,
    functionName: string,
    args: Array<any> | undefined,
    account?: Account | Address | null | undefined
    chain?: Chain | undefined
    /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
    dataSuffix?: Hex | undefined
}
