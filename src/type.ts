import {
    GetContractReturnType,
    BlockTag,
    PublicClient,
    WalletClient,
    Address,
    Abi,
    ContractEventArgs,
    ContractEventName,
    BlockNumber,
    Hex,
    Account,
    Chain,
    WatchContractEventOnLogsFn,
    MulticallReturnType,
    GetCodeParameters,
    HttpTransport
} from 'viem';

export {
    GetContractReturnType,
    BlockTag,
    PublicClient,
    WalletClient,
    Address,
    Abi,
    ContractEventArgs,
    ContractEventName,
    BlockNumber,
    Hex,
    Account,
    Chain,
    WatchContractEventOnLogsFn,
    MulticallReturnType,
    GetCodeParameters
}


export interface ITonStakingClient {
    inConfig: IClientConfig;
    publicClient: PublicClient | any;
    walletClient: WalletClient | any;
    account: Account | Address | undefined

    setPublicClient(): void
    setWalletClient(account : Account | Address | undefined) : void
    getContracts() : Promise<ITonStakingContracts | undefined>
    getContractInfos() : Promise<ITonStakingContractsInfo | undefined>
    getContractAbi() : ITonStakingContractAbi | undefined
    getContractAddresses() : ITonStakingContractAddresses | undefined
    readContractWithName(parameters: IReadContractParameters) : Promise<any>
    readContract(parameters: IReadContract) : Promise<any>
    multiReadContractsWithName<
        const contracts extends readonly unknown[],
        allowFailure extends boolean = true,
    >(parameters: IMulticallParametersWithName) : Promise<MulticallReturnType<contracts, allowFailure> | undefined>
    multiReadContracts<
        const contracts extends readonly unknown[],
        allowFailure extends boolean = true,
    >(parameters: IMulticallParameters) : Promise<MulticallReturnType<contracts, allowFailure> | undefined>

    getCode(parameters: GetCodeParameters) : Promise<any>
    getContractEvents(parameters: IGetContractEventsParameters) : Promise<any>
    getStorageAt(parameters: IGetStorageAtParameters) : Promise<any>
    simulateContract(parameters: IWriteContractParameters) : Promise<any>
    estimateContractGas(parameters: IWriteContractParameters) : Promise<any>
    writeContract(parameters: IWriteContractParameters) : Promise<any>
    watchContractEvent(parameters: IWatchContractEventParameters) : Promise<any>
}

export interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

export interface IClientConfig {
    chainId: number,
    rpcUrl?: string | undefined,
    http?: HttpTransport | undefined,
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

export interface IContractInfo {
    address: Address,
    abi: Abi
}

export interface ITonStakingContractsInfo {
    TON: IContractInfo,
    WTON: IContractInfo,
    Layer2Registry: IContractInfo,
    DepositManager: IContractInfo,
    SeigManager: IContractInfo,
    SwapProxy: IContractInfo,
    DAOCommittee : IContractInfo,
    DAOAgendaManager: IContractInfo,
    Candidate: IContractInfo
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
    contract: string,
    functionName: string,
    args: Array<any> | undefined
}

export interface IReadContract {
    address: Address,
    abi: Abi,
    functionName: string,
    args: Array<any> | undefined
}

export interface IGetContractEventsParameters {
    contract: string,
    args: ContractEventArgs | undefined,
    eventName: ContractEventName<Abi> | string | undefined,
    strict: boolean | undefined,
    fromBlock: BlockNumber | BlockTag | undefined,
    toBlock: BlockNumber | BlockTag | undefined,
}

export interface IGetStorageAtParameters {
    address: Address,
    slot: Hex,
    blockNumber?: undefined
    blockTag?: BlockTag | undefined
}

export interface IWriteContractParameters {
    contract: string,
    functionName: string,
    args: Array<any>,
    account?: Account | Address | null | undefined
    chain?: Chain | undefined
    /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
    dataSuffix?: Hex | undefined
}

export interface IMulticallFunctionParametersWithName {
    contract: string,
    functionName: string,
    args?: Array<any> | undefined,
}

export interface IMulticallParametersWithName {
    contracts: Array<IMulticallFunctionParametersWithName>,
    allowFailure?: boolean| undefined,
    options?: {
        optional?: boolean
        properties?: Record<string, any>
    }| undefined,
}

export interface IMulticallFunctionParameters {
    address: Address,
    abi: Abi,
    functionName: string,
    args?: Array<any> | undefined,
}

export interface IMulticallParameters {
    contracts: Array<IMulticallFunctionParameters>,
    allowFailure?: boolean| undefined,
    options?: {
        optional?: boolean
        properties?: Record<string, any>
    }| undefined,
}

export interface IWatchContractEventParameters {
    contract: string,
    eventName: ContractEventName<Abi> | string | undefined,
    args?: ContractEventArgs | undefined,
    fromBlock?:  BlockNumber<bigint> | undefined,
    onError?: ((error: Error) => void) | undefined
    onLogs: WatchContractEventOnLogsFn
}
