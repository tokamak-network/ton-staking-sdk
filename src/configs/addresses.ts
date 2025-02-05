/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ChainId } from './chains';
import { ITonStakingContractAddresses } from '../type';

export const mainnet_contracts: ITonStakingContractAddresses = {
    TON: "0x2be5e8c109e2197D077D13A82dAead6a9b3433C5",
    WTON: "0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2",
    Layer2Registry: "0x7846c2248a7b4de77e9c2bae7fbb93bfc286837b",
    DepositManager: "0x0b58ca72b12f01fc05f8f252e226f3e2089bd00e",
    SeigManager: "0x0b55a0f463b6defb81c6063973763951712d0e5f",
    SwapProxy: "0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d",
    DAOCommittee : "0xDD9f0cCc044B0781289Ee318e5971b0139602C26",
    DAOAgendaManager: "0xcD4421d082752f363E1687544a09d5112cD4f484"
}

export const sepolia_contracts: ITonStakingContractAddresses  = {
        TON: "0xa30fe40285b8f5c0457dbc3b7c8a280373c40044",
        WTON: "0x79e0d92670106c85e9067b56b8f674340dca0bbd",
        Layer2Registry: "0xA0a9576b437E52114aDA8b0BC4149F2F5c604581",
        DepositManager: "0x90ffcc7F168DceDBEF1Cb6c6eB00cA73F922956F",
        SeigManager: "0x2320542ae933FbAdf8f5B97cA348c7CeDA90fAd7",
        SwapProxy: "0x690f994b82f001059e24d79292c3c476854b767a",
        DAOCommittee: "0xA2101482b28E3D99ff6ced517bA41EFf4971a386",
        DAOAgendaManager: "0x1444f7a8bC26a3c9001a13271D56d6fF36B44f08"
}


export const getContractAddresses = (chainId: number | undefined ) : ITonStakingContractAddresses | undefined => {

    switch (chainId) {
        case ChainId.MAINNET:
            return mainnet_contracts
        case ChainId.SEPOLIA:
            return sepolia_contracts
        default:
            return undefined
    }
}