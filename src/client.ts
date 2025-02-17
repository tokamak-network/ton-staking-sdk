import {
    IClientConfig,
    ITonStakingContracts,
    IReadContractParameters,
    IGetContractEventsParameters,
    ITonStakingContractAddresses,
    IWriteContractParameters,
    IMulticallParameters,
    IGetStorageAtParameters,
    IMulticallFunctionParameters,
    IWatchContractEventParameters,
    ITonStakingContractAbi,
    ITonStakingContractsInfo,
    IContractInfo
} from 'type';
import { getChain, } from './configs/chains';
import { getContractAddresses as getCAddress} from './configs/addresses';
import {
    createWalletClient,
    custom,
    createPublicClient,
    http,
    Client,
    PublicClient,
    WalletClient,
    Account,
    Address,
    GetCodeParameters,
    ContractFunctionParameters,
    MulticallReturnType,
    Abi,
    Chain
 } from 'viem';
import { getTonStakingContracts, getContractInfos } from './models/contracts';
import { getAbis, getContractInfo } from "./lib/utils"
import { mainnet, sepolia } from 'viem/chains';
// import { Logger } from 'winston';
// import { logger } from './configs/logger'

type EthereumProvider = { request(...args: any): Promise<any> }

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export function tonStakingPublicClient(inConfig: IClientConfig) : PublicClient {

    const chain = getChain(inConfig.chainId)

    if(inConfig.rpcUrl !== undefined) {
        return createPublicClient({
            chain: chain,
            transport: http(inConfig.rpcUrl)
        })
    } else if(inConfig.http !== undefined) {
        return createPublicClient({
            chain: chain,
            transport: inConfig.http
        })
    } else {
        return createPublicClient({
            chain: chain,
            transport: http()
        })
    }
}

export function tonStakingWalletClient(
    inConfig: IClientConfig,
    accountOrAddress: Account | Address | undefined = undefined) : WalletClient {

    if(inConfig.rpcUrl !== undefined) {
        return createWalletClient({
            chain: getChain(inConfig.chainId),
            account:  accountOrAddress,
            transport: http(inConfig.rpcUrl)
        })
    } else if(inConfig.http !== undefined) {
        return createWalletClient({
            chain: getChain(inConfig.chainId),
            account:  accountOrAddress,
            transport: inConfig.http
        })
    } else {
        return createWalletClient({
            chain: getChain(inConfig.chainId),
            account:  accountOrAddress,
            transport: http()
        })
    }
}

export class TonStakingClient  {
    inConfig: IClientConfig;
    publicClient: PublicClient | undefined
    walletClient: WalletClient | undefined
    account: Account | Address | undefined
    chain: Chain | undefined
    contractInfos: ITonStakingContractsInfo | undefined
    contractAddresses: ITonStakingContractAddresses | undefined

    constructor(
        inConfig: IClientConfig,
        accountOrAddress: Account | Address | undefined = undefined,
        publicClient: PublicClient| undefined = undefined,
        walletClient: WalletClient| undefined = undefined
    ) {

        this.inConfig = inConfig;
        // this.log = logger(inConfig.logPath, ' TON Staking Client ', inConfig.logLevel !== undefined?inConfig.logLevel:'error')
        if(publicClient!== undefined) {
            this.publicClient = publicClient
        } else this.setPublicClient()

        if(walletClient!== undefined) {
            this.walletClient = walletClient
        } else this.setWalletClient(accountOrAddress)
        this.account = accountOrAddress
        this.chain = getChain(inConfig.chainId)
        this.contractInfos = getContractInfos(inConfig.chainId)
        this.contractAddresses =  getCAddress(inConfig.chainId)
        getContractInfo( this.contractInfos, "TON")

    }

    getPublicClient() : PublicClient | undefined {
        return   (this.publicClient);
    }

    getWalletClient() : WalletClient | undefined {
        return this.walletClient;
    }

    getInConfig() : IClientConfig {
        return this.inConfig;
    }

    getAccount() : Account | Address | undefined {
        return this.account;
    }

    setInConfig(inConfig: IClientConfig) {
        this.inConfig = inConfig;
    }

    setPublicClient() {
        this.publicClient = tonStakingPublicClient(this.inConfig)
    }

    async setWalletClient( account : Account | Address | undefined = undefined) {

        if (account == undefined) {
            if(typeof window !== 'undefined') {
                account = await window.ethereum!.request({ method: 'eth_requestAccounts' })
                // this.log?.debug({account: account})

                this.account = account
            }
        }

        if (account == undefined) {
            // this.log?.debug("account is undefined")
        } else {
            // if(typeof account === 'string') this.log?.debug({account: account})
            // else if(typeof account === 'object') this.log?.debug({account: account.address})
            this.walletClient = tonStakingWalletClient(this.inConfig, account)
        }
    }

    async getContracts() : Promise<ITonStakingContracts | undefined> {
        var contracts = await getTonStakingContracts(this.publicClient, this.walletClient)
        return contracts
    }

    getContractInfos() : ITonStakingContractsInfo | undefined {
        return this.contractInfos
    }

    getContractAddresses() : ITonStakingContractAddresses | undefined {
        return this.contractAddresses
    }

    async readContract(parameters: IReadContractParameters) : Promise<any> {
        if (this.publicClient !== undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                const abi = getAbis(conInfo.abi?conInfo.abi:[], [parameters.functionName])
                return await this.publicClient?.readContract({
                    address: conInfo.address,
                    abi: abi,
                    functionName: parameters.functionName,
                    args: parameters.args?parameters.args: []
                })
            }
        }
    }

    async multiReadContracts<
        const contracts extends readonly unknown[],
        allowFailure extends boolean = true,
    >(parameters: IMulticallParameters) : Promise<
    ({ error?: undefined; result: unknown; status: "success"; }
        | { error: Error; result?: undefined; status: "failure"; })[] | undefined> {

        if (this.publicClient !== undefined && this.contractInfos != undefined) {
            let items:Array<ContractFunctionParameters> = []
            for(let i=0; i< parameters.contracts.length; ++i) {
                const conInfo = getContractInfo(this.contractInfos, parameters.contracts[i].contract)
                if (conInfo != undefined) {
                    items.push(
                        {
                            address: conInfo.address,
                            abi: conInfo.abi,
                            functionName: parameters.contracts[i].functionName,
                            args: parameters.contracts[i].args,
                        }
                    )
                } else {
                    return [{
                        error: Error(),
                        result: undefined,
                        status: "failure"
                    }]
                }
            }

            return await this.publicClient?.multicall({
                contracts: items,
                allowFailure: true
            })
        }
    }

    async getCode(parameters: GetCodeParameters) : Promise<any> {

        if (this.publicClient !== undefined) {
            return await this.publicClient?.getCode({
                address:parameters.address
            })
        }
    }

    async getContractEvents(parameters: IGetContractEventsParameters) : Promise<any> {

        if (this.publicClient !== undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                return await this.publicClient?.getContractEvents({
                    address: conInfo.address,
                    abi: conInfo.abi,
                    eventName: parameters.eventName,
                    args: parameters.args?parameters.args:undefined,
                    fromBlock: parameters.fromBlock?parameters.fromBlock:undefined,
                    toBlock: parameters.toBlock?parameters.toBlock:undefined
                  })
            }
        }
    }

    async getStorageAt(parameters: IGetStorageAtParameters) : Promise<any> {

        if (this.publicClient !== undefined) {

            return await this.publicClient?.getStorageAt({
                address: parameters.address,
                slot: parameters.slot,
                blockNumber: parameters.blockNumber?parameters.blockNumber:undefined,
                blockTag: parameters.blockTag?parameters.blockTag:undefined
              })
        }
    }

    async simulateContract(parameters: IWriteContractParameters) : Promise<any> {

        if (this.publicClient !== undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                return await this.publicClient?.simulateContract({
                    address: conInfo.address,
                    abi: conInfo.abi,
                    functionName: parameters.functionName,
                    args: parameters.args?parameters.args:undefined,
                    account: parameters.account?parameters.account:undefined,
                    chain: parameters.chain?parameters.chain:undefined,
                    dataSuffix: parameters.dataSuffix?parameters.dataSuffix:undefined
                })
            }
        }
    }

    async estimateContractGas(parameters: IWriteContractParameters) : Promise<any> {

        if (this.walletClient !== undefined && this.account != undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                return await this.publicClient?.estimateContractGas({
                    address: conInfo.address,
                    abi: conInfo.abi,
                    functionName: parameters.functionName,
                    args: parameters.args?parameters.args:undefined,
                    account: this.account
                })
            }
        }
    }

    async writeContract(parameters: IWriteContractParameters) : Promise<any> {
        let gas: bigint | undefined
        if (this.walletClient !== undefined && this.account != undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                gas = await this.publicClient?.estimateContractGas({
                    address: conInfo.address,
                    abi: conInfo.abi,
                    functionName: parameters.functionName,
                    args: parameters.args?parameters.args:undefined,
                    account: this.account
                })

                if (gas !== undefined && gas > 0  && this.account != undefined) {

                    const addr:Address = conInfo.address
                    const abi:Abi = conInfo.abi
                    const param: Array<any> = parameters.args
                    const hash = await this.walletClient?.writeContract(
                        {
                            address: addr,
                            abi: abi,
                            functionName: parameters.functionName,
                            args: param,
                            account: this.account,
                            chain: this.chain,
                        },
                    )
                    // this.log?.debug(hash)
                    // WriteContractParameters<abi, functionName, args, chain, account, chainOverride>)
                    return hash
                }
            }
        }
    }

    async watchContractEvent(parameters: IWatchContractEventParameters) : Promise<any> {
        if (this.publicClient !== undefined && this.contractInfos != undefined) {
            const conInfo = getContractInfo(this.contractInfos, parameters.contract)
            if (conInfo != undefined) {
                return await this.publicClient?.watchContractEvent({
                    address: conInfo.address,
                    abi: conInfo.abi,
                    eventName: parameters.eventName,
                    args: parameters.args?parameters.args:undefined,
                    fromBlock:  parameters.fromBlock?parameters.fromBlock:undefined,
                    onError: parameters.onError?parameters.onError:undefined,
                    onLogs: parameters.onLogs
                })
            }
        }
    }
}
