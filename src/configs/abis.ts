/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ITonStakingContractAbi } from '../type';
import { ContractNameForAbi } from './constants';
import { Abi } from 'viem';

import { abi as TONAbi } from '../abis/TON.json';
import { abi as WTONAbi } from '../abis/WTON.json';
import { abi as Layer2RegistryAbi } from '../abis/Layer2Registry.json';
import { abi as DepositManagerAbi } from '../abis/DepositManager.json';
import { abi as SeigManagerAbi } from '../abis/SeigManager.json';
import { abi as DAOCommitteeAbi } from '../abis/DAOCommittee.json';
import { abi as DAOAgendaManagerAbi } from '../abis/DAOAgendaManager.json';
import { abi as ProxyAbi } from '../abis/DepositManagerProxy.json';
import { abi as AutoRefactorCoinageAbi } from '../abis/AutoRefactorCoinage.json';
import { abi as CandidateAbi } from '../abis/Candidate.json';

export const ContractAbi = (name: string): Abi  => {
    switch (name) {
        case ContractNameForAbi.TON :
            return TONAbi as Abi
        case ContractNameForAbi.WTON :
            return WTONAbi as Abi
        case ContractNameForAbi.Layer2Registry :
            return Layer2RegistryAbi as Abi
        case ContractNameForAbi.DepositManager :
            return DepositManagerAbi as Abi
        case ContractNameForAbi.SeigManager :
            return SeigManagerAbi as Abi
        case ContractNameForAbi.DAOCommittee :
            return DAOCommitteeAbi as Abi
        case ContractNameForAbi.DAOAgendaManager :
            return DAOAgendaManagerAbi as Abi
        case ContractNameForAbi.Proxy :
            return ProxyAbi as Abi
        case ContractNameForAbi.Coinage :
            return AutoRefactorCoinageAbi as Abi
        case ContractNameForAbi.Candidate :
            return CandidateAbi as Abi
        default:
            return [] as Abi
    }
}


export const getContractAbi = () : ITonStakingContractAbi => {

    return {
        TON: ContractAbi("TON"),
        WTON: ContractAbi("WTON"),
        Layer2Registry: ContractAbi("Layer2Registry"),
        DepositManager: ContractAbi("DepositManager"),
        SeigManager: ContractAbi("SeigManager"),
        DAOCommittee : ContractAbi("DAOCommittee"),
        DAOAgendaManager: ContractAbi("DAOAgendaManager"),
        Proxy: ContractAbi("DepositManagerProxy"),
        AutoRefactorCoinage: ContractAbi("AutoRefactorCoinage"),
        Candidate: ContractAbi("Candidate"),
    }
}