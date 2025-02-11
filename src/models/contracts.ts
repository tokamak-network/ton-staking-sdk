import {
    IClientConfig, ITonStakingContracts,
    IClients,
    ITonStakingContractAddresses,
    ITonStakingContractAbi } from 'type';

import { getChain } from '../configs/chains';
import { getContractAddresses } from '../configs/addresses';
import { getContractAbi } from '../configs/abis';

import {
    getContract,
    Chain,
    PublicClient,
    Account,
    Address,
    WalletClient,
    Abi
  } from 'viem';

import {Logger} from 'winston';

export async function getTonStakingContracts(
    publicClient: PublicClient | undefined,
    walletClient: WalletClient | undefined,
    log: Logger | undefined
) : Promise<ITonStakingContracts | undefined> {

    var chainId:number| any
    var contractAddresses: ITonStakingContractAddresses | undefined
    var contractAbis: ITonStakingContractAbi

    var client: PublicClient | WalletClient | IClients | any


    if (publicClient == undefined && walletClient == undefined)
        return undefined
    else if (publicClient == undefined) {
      client = walletClient
      chainId = await client?.getChainId()

    } else if (walletClient == undefined) {
      client = publicClient
      chainId = await client?.getChainId()

    } else {
      client = { public: publicClient, wallet: walletClient }
      chainId = await walletClient?.getChainId()
    }

    log?.debug({chainId : chainId})

    contractAddresses = getContractAddresses(chainId)
    log?.debug({contractAddresses : contractAddresses})

    if (contractAddresses != undefined) {
      contractAbis = getContractAbi()

      var contracts: ITonStakingContracts = {
        TON : await getContract({ address: contractAddresses.TON, abi: contractAbis.TON, client: client,}),
        WTON : await getContract({ address: contractAddresses.WTON, abi: contractAbis.WTON, client: client,}),
        Layer2Registry : await getContract({ address: contractAddresses.Layer2Registry, abi: contractAbis.Layer2Registry, client: client,}),
        DepositManager : await getContract({ address: contractAddresses.DepositManager, abi: contractAbis.DepositManager, client: client,}),
        SeigManager : await getContract({ address: contractAddresses.SeigManager, abi: contractAbis.SeigManager, client: client,}),
        SwapProxy : await getContract({ address: contractAddresses.SwapProxy, abi: [], client: client,}),
        DAOCommittee : await getContract({ address: contractAddresses.DAOCommittee, abi: contractAbis.DAOCommittee, client: client,}),
        DAOAgendaManager: await getContract({ address: contractAddresses.DAOAgendaManager, abi: contractAbis.DAOAgendaManager, client: client,}),
      }
      return contracts;
    }
    return undefined;

}