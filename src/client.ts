import { IClientConfig, ITonStakingContracts, IParametersReadContract } from 'type';
import { getChain } from './configs/chains';
import {
    createWalletClient,
    custom,
    createPublicClient,
    http,
    Client,
    Account,
    Address } from 'viem';
import { getTonStakingContracts } from './models/contracts';
import { Logger } from 'winston';
import { logger } from './configs/logger'

type EthereumProvider = { request(...args: any): Promise<any> }

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export function tonStakingPublicClient(config: IClientConfig) : Client {

    return createPublicClient({
        chain: getChain(config.chainId),
        transport: http()
    })
}

export function tonStakingWalletClient(
    inConfig: IClientConfig,
    accountOrAddress: Account | Address | undefined = undefined) : Client {

    return createWalletClient({
        chain: getChain(inConfig.chainId),
        account:  accountOrAddress,
        transport: custom(window.ethereum!)
    })
}

export class TonStakingClient  {
    inConfig: IClientConfig;
    publicClient: Client | any;
    walletClient: Client | any;
    log: Logger

    constructor(inConfig: IClientConfig) {
        this.inConfig = inConfig;
        this.log = logger(inConfig.logPath, ' TON Staking Client ', inConfig.logLevel !== undefined?inConfig.logLevel:'error')
        this.setPublicClient()
        this.setWalletClient()

    }

    setPublicClient() {
        this.publicClient = tonStakingPublicClient(this.inConfig)
    }

    async setWalletClient( account : Account | Address | undefined = undefined) {

        if (account == undefined) {
            if(typeof window !== 'undefined') {
                account = await window.ethereum!.request({ method: 'eth_requestAccounts' })
                this.log?.debug({account: account})
            }
        }

        if (account == undefined) {
            this.log?.debug("account is undefined")
        } else {
            this.walletClient = tonStakingWalletClient(this.inConfig, account)
        }
    }

    async getContracts() : Promise<ITonStakingContracts | undefined> {
        var contracts = await getTonStakingContracts(this.publicClient, this.walletClient, this.log)
        return contracts
    }

    async readContract(parameters: IParametersReadContract) : Promise<any> {

        if (this.publicClient !== undefined) {
            return await this.publicClient?.readContract({
                address: parameters.contract.address,
                abi: parameters.contract.abi,
                functionName: parameters.functionName,
              })
        }
    }
}
