/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Constants defined The TON-Staking Contracts
 * @module Constants
 */

export const ContractNames = {
    TON: "TON",
    WTON: "WTON",
    Layer2Registry: "Layer2Registry",
    DepositManager: "DepositManager",
    SeigManager: "SeigManager",
    DAOCommittee: "DAOCommittee",
    DAOAgendaManager: "DAOAgendaManager",
    Proxy: "Proxy",
    Coinage: "Coinage",
    Candidate: "Candidate",
}

/**
 * Quantity of decimal places of WEI uint
 */
export const DECIMAL_WEI: number = 18;

/**
 * Quantity of decimal places of RAY uint
 */
export const DECIMAL_RAY: number = 27;

/**
 * Default timeout for each request in milliseconds
 */
export const TIMEOUT: number = 10000;

/**
 * Maximum number of inputs
 */
export const MAX_INPUTS: number = 255;

/**
 * Maximum number of outputs
 */
export const MAX_OUTPUTS: number = 255;
