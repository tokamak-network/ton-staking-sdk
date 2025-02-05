/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type optionsType = {
  signalBits?: number;
  version?: number;
  weight?: number;
  nonce?: number;
  timestamp?: number | null;
  parents?: string[];
  tokens?: string[];
  hash?: string | null;
};

class Transaction {

}

export default Transaction;
