/**
 * Copyright (c) Tokamak Network.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { mainnet, sepolia } from 'viem/chains';
import type { Chain } from 'viem'
export enum ChainId {
    MAINNET = 1,
    SEPOLIA = 11155111,
    NONE = 0,
}

export enum ChainName {
  MAINNET = "mainnet",
  SEPOLIA = "sepolia",
  NONE = "unknown"
}

export const getChainName = (chanId: Number) => {
  switch (chanId) {
    case ChainId.MAINNET:
      return ChainId.MAINNET
    case ChainId.SEPOLIA:
      return ChainId.SEPOLIA
    default:
      return ChainId.NONE
  }
}

export const getChainId = (chanName: String) => {
  switch (chanName.toUpperCase()) {
    case ChainName.MAINNET.toUpperCase():
      return ChainId.MAINNET
    case ChainName.SEPOLIA.toUpperCase():
      return ChainId.SEPOLIA
    default:
      return ChainId.NONE
  }
}

export const getChain = (chanId: Number): Chain | undefined => {
  switch (chanId) {
    case ChainId.MAINNET:
      return mainnet
    case ChainId.SEPOLIA:
      return sepolia
    default:
      return undefined
  }
}
