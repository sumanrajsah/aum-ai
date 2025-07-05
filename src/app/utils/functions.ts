// import { deployContract, getAccount, sendTransaction, signMessage, verifyMessage, writeContract } from "@wagmi/core";
// import { parseEther } from "viem";
// import { config } from "../config";
// import { SiweMessage } from 'siwe'

// export const supportedChains = [
//     "ethereum",
//     "polygon",
//     "bsctestnet",
//     "arbitrum",
//     "optimism",
//     "sepolia",
//     "polygon-amoy",
//     "base-sepolia",
//     "avalanche",
//     "base",
//     "bsc",
//     "monadTestnet",
//     "monad-testnet",

// ];

// export function getChainId(chainName: string) {
//     // Mapping of chain names to their respective chain IDs
//     const chainIdMap: { [key: string]: number } = {
//         "ethereum": 1,
//         "ropsten": 3,
//         "rinkeby": 4,
//         "goerli": 5,
//         "kovan": 42,
//         "polygon": 137,
//         "mumbai": 80001,
//         "bsc": 56,
//         "bsctestnet": 97,
//         "avalanche": 43114,
//         "fuji": 43113,
//         "fantom": 250,
//         "arbitrum": 42161,
//         "optimism": 10,
//         "sepolia": 11155111,
//         "binance-smart-chain": 56,
//         "polygon-amoy": 80002,
//         "amoy": 80002,
//         "base": 8453,
//         "base-sepolia": 84532,
//         "baseSepolia": 84532,
//     };

//     // Convert the chain name to lowercase to make the lookup case-insensitive
//     const normalizedChainName = chainName.toLowerCase();

//     // Return the chain ID if the chain name exists in the map
//     if (chainIdMap.hasOwnProperty(normalizedChainName)) {
//         return chainIdMap[normalizedChainName];
//     } else {
//         throw new Error(`Unknown chain name: ${chainName}`);
//     }
// }
// export async function makeTransaction(args: any) {
//     try {
//         const result = await sendTransaction(config, {
//             to: args.address as `0x${string}`,
//             value: parseEther(`${args.amount}`),
//             chainId: getChainId(args.chain),
//         });
//         console.log(result)

//         if (result) {

//             return `tx hash ${result}`;
//         }
//     } catch (error: any) {
//         return 'Transaction rejected by user';
//     }
// }
// export async function writeSmartContract(args: any) {
//     console.log(args)
//     const account = getAccount(config)

//     try {

//         const result = await writeContract(config, {
//             abi: JSON.parse(args.abi),
//             address: args.address,
//             chainId: args.chainId,
//             functionName: args.functionName,
//             args: args.args,
//             account: account.address
//         })
//         console.log(result)
//         return `tx hash ${result}`
//     } catch (error) {
//         console.log(error)
//     }
// }

// export async function signInWithEthereum() {
//     const account = getAccount(config)
//     console.log('swe')

//     try {
//         const message = new SiweMessage({
//             domain: window.location.host,
//             address: account.address,
//             statement: 'Welcome to 0xXplorer Ai! Sign in to join our platform and unlock perks!',
//             uri: window.location.origin,
//             version: '1',
//             chainId: account.chainId,
//         });

//         const result = await signMessage(config, { message: message.prepareMessage() })
//         const v = await verifyMessage(config, {
//             address: account.address as `0x${string}`,
//             message: message.prepareMessage(),
//             signature: result,
//         })
//         return v;
//     } catch (error) {
//         console.log(error)
//     }
// }
// export async function deploySmartContract(args: any) {
//     console.log(args)
//     const account = getAccount(config)

//     try {

//         const result = await deployContract(config, {
//             bytecode: `0x${args.bytecode}`,
//             abi: JSON.parse(args.abi),
//             chainId: account.chainId,
//             args: args.args,
//             account: account.address
//         })
//         console.log(result)
//         return `tx hash ${result}`
//     } catch (error) {
//         console.log(error)
//     }
// }
// export async function deploySmartButtonContract(bytecode: any, abi: any[], arg: any[]) {
//     const account = getAccount(config)
//     console.log('action')
//     try {

//         const result = await deployContract(config, {
//             bytecode: bytecode,
//             abi: abi,
//             chainId: account.chainId,
//             args: arg,
//             account: account.address
//         })
//         console.log(result)
//     } catch (error) {
//         console.log(error)
//     }
// }