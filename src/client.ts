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
    IWatchContractEventParameters
} from 'type';
import { getChain } from './configs/chains';
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
    GetStorageAtParameters,
    GetContractEventsParameters,
    MulticallParameters,
    ContractFunctionParameters,
    MulticallReturnType,
    WatchContractEventParameters,
 } from 'viem';
import { getTonStakingContracts } from './models/contracts';
import { Logger } from 'winston';
import { logger } from './configs/logger'

type EthereumProvider = { request(...args: any): Promise<any> }

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export function tonStakingPublicClient(inConfig: IClientConfig) : Client {
    var rpc = inConfig.rpcUrl?inConfig.rpcUrl:undefined

    return createPublicClient({
        chain: getChain(inConfig.chainId),
        transport: http(rpc)
    })

}

export function tonStakingWalletClient(
    inConfig: IClientConfig,
    accountOrAddress: Account | Address | undefined = undefined) : Client {

    var rpc = inConfig.rpcUrl?inConfig.rpcUrl:undefined
    var http_ = (typeof window !== 'undefined' && window.ethereum !== undefined)?
                custom(window.ethereum!):http(rpc)

    return createWalletClient({
        chain: getChain(inConfig.chainId),
        account:  accountOrAddress,
        transport: http_
    })
}

export class TonStakingClient  {
    inConfig: IClientConfig;
    publicClient: PublicClient | any;
    walletClient: WalletClient | any;
    log: Logger
    account: Account | Address | undefined

    constructor(inConfig: IClientConfig, accountOrAddress: Account | Address | undefined = undefined) {
        this.inConfig = inConfig;
        this.log = logger(inConfig.logPath, ' TON Staking Client ', inConfig.logLevel !== undefined?inConfig.logLevel:'error')
        this.setPublicClient()
        this.setWalletClient(accountOrAddress)
        this.account = accountOrAddress

    }

    setPublicClient() {
        this.publicClient = tonStakingPublicClient(this.inConfig)
    }

    async setWalletClient( account : Account | Address | undefined = undefined) {

        if (account == undefined) {
            if(typeof window !== 'undefined') {
                account = await window.ethereum!.request({ method: 'eth_requestAccounts' })
                this.log?.debug({account: account})

                this.account = account
            }
        }

        if (account == undefined) {
            this.log?.debug("account is undefined")
        } else {
            if(typeof account === 'string') this.log?.debug({account: account})
            else if(typeof account === 'object') this.log?.debug({account: account.address})

            this.walletClient = tonStakingWalletClient(this.inConfig, account)
        }
    }

    async getContracts() : Promise<ITonStakingContracts | undefined> {
        var contracts = await getTonStakingContracts(this.publicClient, this.walletClient, this.log)
        return contracts
    }

    getContractAddresses() : ITonStakingContractAddresses | undefined {
        return getCAddress(this.inConfig.chainId)
    }

    async readContract(parameters: IReadContractParameters) : Promise<any> {
        if (this.publicClient !== undefined) {
            return await this.publicClient?.readContract({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                functionName: parameters.functionName,
                args: parameters.args
              })
        }
    }

    async multiReadContracts<
        const contracts extends readonly unknown[],
        allowFailure extends boolean = true,
    >(parameters: IMulticallParameters) : Promise<MulticallReturnType<contracts, allowFailure> | undefined> {

        if (this.publicClient !== undefined) {

            let items:Array<ContractFunctionParameters> = []
            for(let i=0; i< parameters.contracts.length; ++i) {

                let contract:IMulticallFunctionParameters = parameters.contracts[i]
                items.push(
                    {
                        address: contract.contract.address,
                        abi: contract.contract.abi,
                        functionName: contract.functionName,
                        args: contract.args,
                    }
                )
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

        if (this.publicClient !== undefined) {

            return await this.publicClient?.getContractEvents({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                eventName: parameters.eventName,
                args: parameters.args?parameters.args:undefined,
                fromBlock: parameters.fromBlock?parameters.fromBlock:undefined,
                toBlock: parameters.toBlock?parameters.toBlock:undefined
              })
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

        if (this.publicClient !== undefined) {
            return await this.publicClient?.simulateContract({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                functionName: parameters.functionName,
                args: parameters.args?parameters.args:undefined,
                account: parameters.account?parameters.account:undefined,
                chain: parameters.chain?parameters.chain:undefined,
                dataSuffix: parameters.dataSuffix?parameters.dataSuffix:undefined
              })
        }
    }

    async estimateContractGas(parameters: IWriteContractParameters) : Promise<any> {

        if (this.walletClient !== undefined && this.account != undefined) {
            return await this.publicClient?.estimateContractGas({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                functionName: parameters.functionName,
                args: parameters.args?parameters.args:undefined,
                account: this.account
            })
        }
    }

    async writeContract(parameters: IWriteContractParameters) : Promise<any> {

        if (this.walletClient !== undefined && this.account != undefined) {
            const gas = await this.publicClient?.estimateContractGas({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                functionName: parameters.functionName,
                args: parameters.args?parameters.args:undefined,
                account: this.account
            })

            this.log?.debug({estimateContractGas: gas})

            if (gas !== undefined && gas !== 0) {
                const hash = await this.walletClient?.writeContract(
                    {
                        address: parameters.contract.address,
                        abi: parameters.contract.abi,
                        functionName: parameters.functionName,
                        args: parameters.args?parameters.args:undefined,
                        account: this.account
                    }
                )
                this.log?.debug(hash)

                return hash
            }
        }
    }

    async watchContractEvent(parameters: IWatchContractEventParameters) : Promise<any> {

        if (this.publicClient !== undefined) {
            return await this.publicClient?.watchContractEvent({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                eventName: parameters.eventName,
                args: parameters.args?parameters.args:undefined,
                fromBlock:  parameters.fromBlock?parameters.fromBlock:undefined,
                onError: parameters.onError?parameters.onError:undefined,
                onLogs: parameters.onLogs?parameters.onLogs:undefined
              })
        }
    }
}
