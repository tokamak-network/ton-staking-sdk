import { TonStakingClient } from './client';
import { getChain, getChainId } from './configs/chains';
import { ContractNames } from './configs/constants';
import { getContractAddresses as getCAddress} from './configs/addresses';
import { getTonStakingContracts, getContractInfos } from './models/contracts';
export {
    ITonStakingClient,
    IClientConfig,
    IClients,
    ITonStakingContracts,
    ITonStakingContractAddresses,
    ITonStakingContractAbi,
    IReadContractParameters,
    IGetContractEventsParameters,
    IGetStorageAtParameters,
    IWriteContractParameters,
    IMulticallFunctionParameters,
    IMulticallParameters,
    IWatchContractEventParameters,
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
} from './type';

export {
    TonStakingClient,
    getChain,
    getChainId,
    getCAddress,
    getTonStakingContracts,
    getContractInfos,
    ContractNames
}
