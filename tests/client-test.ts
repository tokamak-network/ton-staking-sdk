import {TonStakingClient} from '../dist/mjs/index'

const main = async () => {

    //=============================
    const tsClientMainnet = new TonStakingClient({ chainId: 1, logLevel: 'error'})

    const tsContractsMainnet = await tsClientMainnet.getContracts()

    const data = await tsClientMainnet.readContract({
        contract: tsContractsMainnet.TON,
        functionName: 'totalSupply',
      })

    console.log('Mainnet TON totalSupply ', data)

    console.log('=======================')
    //=============================
    // logLevel: { // 숫자가 낮을 수록 우선순위가 높습니다.
    //     error: 0, == default
    //     debug: 1,
    //     warn: 2,
    //     info: 3,
    //     data: 4,
    //     verbose: 5,
    //     silly: 6,
    //     custom: 7
    // },

    const tsClientSepolia = new TonStakingClient(
        { chainId: 11155111, logLevel: 'debug'})

    const tsContractsSepolia = await tsClientSepolia.getContracts()

    const data1 = await tsClientSepolia.readContract({
        contract: tsContractsSepolia.TON,
        functionName: 'totalSupply',
      })

    console.log('Sepolia TON totalSupply ', data1)
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
