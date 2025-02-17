import {TonStakingClient} from '../dist/mjs/index'
import { privateKeyToAccount } from 'viem/accounts'
import { toHex, parseEther } from 'viem'

import dotenv from "dotenv"
dotenv.config()

const main = async () => {

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)
    const tsClientSepolia = new TonStakingClient(
      {
        chainId: 11155111,
        rpcUrl: `${process.env.ETH_NODE_URI_SEPOLIA}`,
        // logLevel: 'debug',
      },
      account  // Required when setting up walletClient. Used when sending transactions to an account.
    )

    //==============================
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
