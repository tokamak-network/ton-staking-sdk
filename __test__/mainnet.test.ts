import {
    describe,
    expect,
    test,
    beforeAll,
    afterAll,
    beforeEach
} from '@jest/globals';

import {TonStakingClient} from '../dist/cjs/index'
import { toHex } from 'viem'

import dotenv from "dotenv"
dotenv.config()

let Client: any, tsContracts:any, tsContractAddresses: any

describe('\nMainnet interface', () => {


    beforeAll(async() => {
        Client = new TonStakingClient({
            chainId: 1,
            // logLevel:'debug'
            rpcUrl: `${process.env.ETH_NODE_URI_MAINNET}`
        })

        tsContracts = await Client.getContracts()
        tsContractAddresses = Client.getContractAddresses()

    });

    test("readContract : TON.totalSupply", async () => {

        const totalSupply = await Client.readContract({
            contract: tsContracts.TON,
            functionName: 'totalSupply',
        })
        expect(totalSupply).toBeGreaterThan(0);
    });

    test("readContract : TON.balanceOf", async () => {
        const addr = '0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2'
        const balanceOf = await Client.readContract({
            contract: tsContracts.TON,
            functionName: 'balanceOf',
            args: [addr]
        })
        expect(balanceOf).toBe(0n);
    });


    test("getStorageAt : Slot(0) of WTON", async () => {
        const slot0 = await Client.getStorageAt({
            address: tsContractAddresses!.WTON,
            slot: toHex(0),
        })
        expect(slot0).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
    });

    test("getCode ", async () => {
        const code = await Client.getCode({
            address: tsContractAddresses!.TON
        })
        expect(code.length).toBeGreaterThan(0);
    });

    test("getContractEvents: TON's Transfer ", async () => {
        // You must set your rpcUrl when creating TonStakingClient, otherwise it will fail to fetch.
        // Fetch event logs for every event
        const fromBlock = 21792097
        const logs = await Client.getContractEvents({
            contract: tsContracts.TON,
            eventName: 'Transfer',
            fromBlock: toHex(fromBlock),
            toBlock: "latest"
        })

        expect(logs.length).toBeGreaterThan(0);
    });

    test("simulateContract ", async () => {
        const addr = '0x838F176D94990E06af9B57E470047F9978403195'
        const res = await Client.simulateContract({
            contract: tsContracts.TON,
            functionName: 'balanceOf',
            args: [addr]
        })
        // console.log('Sepolia '+addr+' simulate balanceOf ', res)
        expect(res.result).toBeGreaterThan(0n);
    });
});

