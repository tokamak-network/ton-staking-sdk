/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ITonStakingContractAbi } from '../type';
import { ContractNames } from './constants';
import { Abi } from 'viem';

import { abi as TONAbi } from './abiRaw/TON.json';
import { abi as WTONAbi } from './abiRaw/WTON.json';
import { abi as Layer2RegistryAbi } from './abiRaw/Layer2Registry.json';
import { abi as DepositManagerAbi } from './abiRaw/DepositManager.json';
import { abi as SeigManagerAbi } from './abiRaw/SeigManager.json';
import { abi as DAOCommitteeAbi } from './abiRaw/DAOCommittee.json';
import { abi as DAOAgendaManagerAbi } from './abiRaw/DAOAgendaManager.json';
import { abi as ProxyAbi } from './abiRaw/DepositManagerProxy.json';
import { abi as AutoRefactorCoinageAbi } from './abiRaw/AutoRefactorCoinage.json';
import { abi as CandidateAbi } from './abiRaw/Candidate.json';

export const ContractAbi = (name: string): Abi  => {
    switch (name) {
        case ContractNames.TON :
            return TONAbi as Abi
        case ContractNames.WTON :
            return WTONAbi as Abi
        case ContractNames.Layer2Registry :
            return Layer2RegistryAbi as Abi
        case ContractNames.DepositManager :
            return DepositManagerAbi as Abi
        case ContractNames.SeigManager :
            return SeigManagerAbi as Abi
        case ContractNames.DAOCommittee :
            return DAOCommitteeAbi as Abi
        case ContractNames.DAOAgendaManager :
            return DAOAgendaManagerAbi as Abi
        case ContractNames.Proxy :
            return ProxyAbi as Abi
        case ContractNames.Coinage :
            return AutoRefactorCoinageAbi as Abi
        case ContractNames.Candidate :
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