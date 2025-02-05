import { GetContractReturnType } from 'viem';
import {
    PublicClient,
    WalletClient,
    Address,
    Abi
  } from 'viem';

export interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

export interface IClientConfig {
    chainId: number,
    logLevel: string | undefined
    logPath: string | undefined
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

export interface IParametersReadContract {
    contract: GetContractReturnType,
    functionName: string
}