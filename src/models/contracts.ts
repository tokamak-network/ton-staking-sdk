import {
    ITonStakingContracts,
    IClients,
    ITonStakingContractAddresses,
    ITonStakingContractAbi,
    ITonStakingContractsInfo,
  } from 'type';

import { getContractAddresses } from '../configs/addresses';
import { getContractAbi } from '../configs/abis';

import {
    Client,
    getContract,
    PublicClient,
    WalletClient,
  } from 'viem';

// import {Logger} from 'winston';

export async function getTonStakingContracts(
    publicClient: PublicClient | undefined,
    walletClient: WalletClient | undefined,
    // log: Logger | undefined
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

    // log?.debug({chainId : chainId})

    contractAddresses = getContractAddresses(chainId)
    // log?.debug({contractAddresses : contractAddresses})

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


export function getContractInfos(chainId: number) : ITonStakingContractsInfo {
  var contractAbis = getContractAbi()
  var contractAddress = getContractAddresses(chainId)

  return {
      TON: {
        address: contractAddress?.TON,
        abi: contractAbis?.TON,
      },
      WTON: {
        address: contractAddress?.WTON,
        abi: contractAbis?.WTON,
      },
      Layer2Registry: {
        address: contractAddress?.Layer2Registry,
        abi: contractAbis?.Layer2Registry,
      },
      DepositManager: {
        address: contractAddress?.DepositManager,
        abi: contractAbis?.DepositManager,
      },
      SeigManager: {
        address: contractAddress?.SeigManager,
        abi: contractAbis?.SeigManager,
      },
      SwapProxy: {
        address: contractAddress?.SwapProxy,
        abi: [],
      },
      DAOCommittee : {
        address: contractAddress?.DAOCommittee,
        abi: contractAbis?.DAOCommittee,
      },
      DAOAgendaManager: {
        address: contractAddress?.DAOAgendaManager,
        abi: contractAbis?.DAOAgendaManager,
      }
  }

}


