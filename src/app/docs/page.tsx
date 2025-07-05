"use client"
import React from "react";
import Image from 'next/image'
import './style.css'
import Sidebar from "./components/sidebar";
import Link from "next/link";
export default function DocsPage() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="docs-body">
            <div className="docs-nav">
                <div style={{ cursor: 'pointer' }} className={isOpen ? "ham2" : "ham"} onClick={() => setIsOpen(!isOpen)}><h1>|||</h1></div>
                <Image src="/0xai.png" className="logo" alt="Logo" width={100} height={100} /><h3>0xXplorer Ai Docs</h3>
            </div>
            <h1 className="docs-head">
                Welcome to 0xXplorer Ai
            </h1>
            <div className="docs-body-cont">
                <div className={isOpen ? "sidebar-cont" : "sidebar-cont1"}>
                    <Link href="#Getting-Started">Getting Started</Link>
                    <Link href="#How-to-Use-0xXplorer-Ai">How to Use 0xXplorer Ai?</Link>
                    <Link href="#wallet-prompts">Wallet Interaction</Link>
                    <Link href="#account-prompts">Account Interaction</Link>
                    <Link href="#tx-prompts">Transaction Interactions</Link>
                    <Link href="#blockchain-prompt">Blocks Interaction</Link>
                    <Link href="#gas-fees-prompt">Gas Fees</Link>
                    <Link href="#real-time-data">Real-Time Data</Link>
                    <Link href="#contract-propmt">Smart Contract Interaction</Link>
                    <br />
                    <Link href="/"><button style={{ padding: '10px', cursor: 'pointer', width: "100px" }}>AI</button></Link>

                    <a href={`mailto:support@squarexlabs.io`}>contact us</a>
                    <br />
                    <p style={{ textDecoration: "none" }}>Created By SquareX Labs with </p>
                    <p>&#128150;</p>
                </div>
                <div className="docs-content">
                    <section id="Getting-Started">
                        <div className="docs-box">
                            <h1>Getting Started with 0xXplorer Ai 🚀</h1>
                            <p>Welcome to 0xXplorer Ai, your AI-powered blockchain assistant! Whether you're a developer, investor, or blockchain enthusiast, 0xXplorer Ai is here to simplify your journey into decentralized technologies. This guide will walk you through everything you need to know to get started and make the most of 0xXplorer Ai.</p>

                            <h3>What is 0xXplorer Ai? 🤖</h3>
                            <p>0xXplorer Ai is an advanced AI-powered blockchain assistant developed by SquareX Labs, under the visionary leadership of Qubicsquare Technologies Private Limited. It is powered by SitrAi, a cutting-edge AI platform designed to provide expert-level insights and assistance in blockchain technology.</p>

                            <h4>Key Features of 0xXplorer Ai:</h4>
                            <ul>
                                <li><strong>Blockchain Expertise:</strong> In-depth knowledge of decentralized technologies, cryptocurrencies, smart contracts, and distributed ledger systems.</li>
                                <li><strong>Multi-Chain Support:</strong> Works seamlessly with Ethereum, Polygon, BSC, Avalanche, Arbitrum, Optimism, and more.</li>
                                <li><strong>Real-Time Data:</strong> Fetch real-time cryptocurrency prices, gas fees, and the latest blockchain news.</li>
                                <li><strong>Wallet Integration:</strong> Securely connect your wallet to interact with blockchain networks.</li>
                                <li><strong>Smart Contract Assistance:</strong> Create, compile, and deploy smart contracts with ease.</li>
                                <li><strong>Gas Fee Optimization:</strong> Understand and optimize gas fees for efficient transactions.</li>
                            </ul>

                            <h4>Supported Chains 🌐</h4>
                            <ul>
                                <h1>Mainnets</h1>
                                <li><strong>Arbitrum</strong> (Chain ID: 42161)</li>
                                <li><strong>Avalanche</strong> (Chain ID: 43114)</li>
                                <li><strong>Base</strong> (Chain ID: 8453)</li>
                                <li><strong>BSC</strong> (Chain ID: 56)</li>
                                <li><strong>Ethereum</strong> (Chain ID: 1)</li>
                                <li><strong>Optimism</strong> (Chain ID: 10)</li>
                                <li><strong>Polygon</strong> (Chain ID: 137)</li>
                                <h1>Testnets</h1>
                                <li><strong>Base Sepolia</strong> (Chain ID: 84532)</li>
                                <li><strong>BSC Testnet</strong> (Chain ID: 97)</li>
                                <li><strong>Monad Testnet</strong> (Chain ID: 10143)</li>
                                <li><strong>Polygon Amoy</strong> (Chain ID: 80002)</li>
                                <li><strong>Sepolia</strong> (Chain ID: 11155111)</li>
                            </ul>
                        </div>
                    </section>
                    <section id="How-to-Use-0xXplorer-Ai">
                        <div className="docs-box">
                            <h1>How to Use 0xXplorer Ai?</h1>
                            <p>Simply type your query or request, and 0xXplorer Ai will provide detailed, accurate, and actionable responses. Here are some examples of what you can ask:</p>
                            <ul>
                                <li><strong>"Explain how Proof of Stake works."</strong></li>
                                <li><strong>"Help me deploy a smart contract on Ethereum."</strong></li>
                                <li><strong>"What’s the price of Bitcoin today?"</strong></li>
                                <li><strong>"Connect my wallet."</strong></li>
                            </ul>
                        </div>
                    </section>
                    <section id="wallet-prompts">
                        <div className="docs-box">
                            <h1>Wallet Interaction with 0xXplorer Ai 🔗</h1>
                            <p>0xXplorer Ai makes it easy to connect, disconnect, and interact with your wallet securely. Below is a detailed guide on how to manage your wallet interactions using simple prompts.</p>
                            <h1>1. Connect Your Wallet</h1>
                            <p>To connect your wallet and start interacting with blockchain networks, use any of the following commands:</p>
                            <h3>Commands to Connect Wallet:</h3>
                            <ul>
                                <li><strong>"Login"</strong></li>
                                <li><strong>"Connect"</strong></li>
                                <li><strong>"Connect wallet"</strong></li>
                            </ul>
                            <h3>What Happens Next?</h3>
                            <ul>
                                <li>0xXplorer Ai will automatically trigger the <strong>connectWallet</strong> tool.</li>
                                <li>Follow the on-screen prompts to securely connect your wallet.</li>
                                <li>Once connected, you’ll see a confirmation message:<br />
                                    <strong >
                                        ✅ "You're successfully connected to this app! 🚀"
                                    </strong>
                                </li>
                            </ul>
                            <h1>2. Disconnect Your Wallet</h1>
                            <p>If you want to disconnect your wallet, use any of the following commands:</p>
                            <h3>Commands to Disconnect Wallet:</h3>
                            <ul>
                                <li><strong>"Logout"</strong></li>
                                <li><strong>"Disconnect"</strong></li>
                                <li><strong>"disconnect wallet"</strong></li>
                            </ul>
                            <h3>What Happens Next?</h3>
                            <ul>
                                <li>0xXplorer Ai will disconnect your wallet.</li>
                                <li>You’ll see a confirmation message:<br />
                                    <strong>
                                        ✅ "Your wallet has been disconnected. 😊🔗"
                                    </strong>
                                </li>
                            </ul>
                            <h1>3. Sign In with Ethereum</h1>
                            <p>To sign in with Ethereum and authenticate your identity, use any of the following commands:</p>
                            <h3>Commands to Sign In with Ethereum:</h3>
                            <ul>
                                <li><strong>"signin"</strong></li>
                                <li><strong>"Sign in with ethereum"</strong></li>
                                <li><strong>"Sign in with ETH"</strong></li>
                            </ul>
                            <h3>What Happens Next?</h3>
                            <ul>
                                <li>0xXplorer Ai will initiate the Sign-In with Ethereum process.</li>
                                <li>Follow the prompts to sign a message with your wallet to authenticate.</li>
                                <li>Once signed in, you’ll see a confirmation message:<br />
                                    <strong>
                                        ✅ "YYou're successfully connected and verified to this app! 🚀"
                                    </strong>
                                </li>
                            </ul>
                            <h1>4. Switching Networks with 0xXplorer Ai 🌐</h1>
                            <p>0xXplorer Ai supports multiple blockchain networks, and switching between them is simple. Whether you want to interact with Ethereum, Polygon, BSC, or any other supported network, here’s how you can switch networks seamlessly.</p>
                            <h3>Commands to Switch Network:</h3>
                            <ul>
                                <li><strong>"switch"</strong></li>
                                <li><strong>"switch network"</strong></li>
                                <li><strong>"change network"</strong></li>
                            </ul>

                        </div>
                    </section>
                    <section id="account-prompts">
                        <div className="docs-box">
                            <h1>Account Interaction with 0xXplorer Ai 👤</h1>
                            <p>0xXplorer Ai allows you to interact with your blockchain account seamlessly. Whether you want to check your balance, view transaction history, or manage your account settings, here’s a detailed guide on how to do it.</p>
                            <h3>1. Check Account Balance</h3>
                            <p>To check the balance of your connected wallet, use the following commands:</p>
                            <h3>Commands to Check Balance:</h3>
                            <ul>
                                <li><strong>"check my bal on <span>[network name]</span> (eg. eth,polygon,sepolia .etc)"</strong></li>
                                <li><strong>"bal of <span>[wallet address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"bal of <span>[ENS Domain Name]</span> on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>2. View Transaction History</h3>
                            <p>To view the transaction history of your connected wallet, use the following commands:</p>
                            <h3>Commands to View Transaction History:</h3>
                            <ul>
                                <li><strong>"<span>[no of tx]</span>tx history of my address on <span>[network name]</span> (eg. eth,polygon,sepolia .etc)"</strong></li>
                                <li><strong>"list of <span>[no of tx]</span> tx of <span>[wallet address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"list of <span>[no of tx]</span> normal tx of <span>[wallet address]</span> on <span>[network name]</span>"</strong></li>
                            </ul>
                            <strong>👉**By default it show 5 or 10 list of transactions**</strong>
                            <h3>3. Total number of Transaction</h3>
                            <p>To check the total number of transactions for your connected wallet, use the following commands:</p>
                            <h3>Commands to Check Total Number of Transactions:</h3>
                            <ul>
                                <li><strong>"Total number of transactions on <span>[network name]</span> (eg. eth,polygon,sepolia .etc)"</strong></li>
                                <li><strong>"Total TX of <span>[wallet address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"Total TX of <span>[ENS Domain Name]</span> on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>4. View Internal Transaction History</h3>
                            <p>To view the internal transaction history of your connected wallet, use the following commands:</p>
                            <h3>Commands to View Transaction History:</h3>
                            <ul>
                                <li><strong>"<span>[no of tx]</span>internal tx history of my address on <span>[network name]</span>(eg. eth,polygon,sepolia .etc) "</strong></li>
                                <li><strong>"list of <span>[no of tx]</span> internal tx of <span>[wallet address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"list of <span>[no of tx]</span> internal tx of <span>[ENS Domain Name]</span> on <span>[network name]</span>"</strong></li>
                            </ul>
                            <strong>👉**By default it show 5 or 10 list of transactions**</strong>
                            <h3>5. Getting Address from ENS (Ethereum Name Service) </h3>
                            <p>To get the Ethereum address associated with an ENS name, use the following commands:</p>
                            <h3>Commands to Resolve ENS:</h3>
                            <ul>
                                <li><strong>"address of <span>[ENS Domain Name]</span>"</strong></li>
                            </ul>
                        </div>
                    </section>
                    <section id="tx-prompts">
                        <div className="docs-box">
                            <h1>Transaction Interactions with 0xXplorer Ai 💸</h1>
                            <p>0xXplorer Ai simplifies the process of sending, tracking, and managing transactions on supported blockchain networks. Whether you're sending cryptocurrency, checking transaction status, or analyzing gas fees, here’s a detailed guide on how to interact with transactions using 0xXplorer Ai.</p>
                            <h3>1. Send a Transaction</h3>
                            <p>To send a transaction (e.g., sending cryptocurrency to another address), use the following commands:</p>
                            <h3>Commands to Send a Transaction:</h3>
                            <ul>
                                <li><strong>"send <span>[amount] [Token/Currency]</span> to <span>[ENS Domain Name]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"send <span>[amount] [Token/Currency]</span> to <span>[Address]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"Transfer <span>[amount] [Token/Currency]</span> to <span>[Address/ENS Domain Name]</span>on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>2. Check Transaction Status</h3>
                            <p>To check the status of a transaction (e.g., pending, confirmed, or failed), use the following commands:</p>
                            <h3>Commands to Check Transaction Status:</h3>
                            <ul>
                                <li><strong>"tx status of<span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"transaction status of <span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>3. View Transaction Details</h3>
                            <p>To view detailed information about a specific transaction, use the following commands:</p>
                            <h3>Commands to View Transaction Details:</h3>
                            <ul>
                                <li><strong>"tx<span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"tx hash<span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"transaction <span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>3. View Transaction Receipt</h3>
                            <p>To fetch the receipt for a specific transaction, use the following commands:</p>
                            <h3>Commands to Fetch Transaction Receipt:</h3>
                            <ul>
                                <li><strong>"tx receipt<span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"tx receipt hash<span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"transaction receipt <span>[tx hash]</span>on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>4. View Internal Transaction List</h3>
                            <p>To view the list internal transaction performed within a transaction., use the following commands:</p>
                            <h3>Commands to View list of internal Transaction:</h3>
                            <ul>
                                <li><strong>"<span>[no of tx]</span>internal tx history of tx <span>[tx hash]</span> on <span>[network name]</span>(eg. eth,polygon,sepolia .etc) "</strong></li>
                                <li><strong>"list of <span>[no of tx]</span> internal tx of <span>[tx hash]</span> on <span>[network name]</span>"</strong></li>
                            </ul>
                            <strong>👉**By default it show 5 or 10 list of transactions**</strong>
                        </div>
                    </section>
                    <section id="blockchain-prompt">
                        <div className="docs-box">
                            <h1>Blocks Interaction with 0xXplorer Ai 🧱</h1>
                            <p>0xXplorer Ai allows you to interact with blockchain data directly, such as fetching block information, checking the latest block, or exploring specific details about blocks. Whether you're a developer, researcher, or enthusiast, here’s how you can explore blockchain data using 0xXplorer Ai.</p>
                            <h3>1. Get Latest Block</h3>
                            <p>To fetch details about the latest block on the blockchain, use the following commands:</p>
                            <h3>Commands to Get Latest Block:</h3>
                            <ul>
                                <li><strong>"Get latest block on <span>[network name]</span>"</strong></li>
                                <li><strong>"What is the latest block on <span>[network name]</span>?"</strong></li>
                                <li><strong>"Show latest block on <span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>2. Get Block Information</h3>
                            <p>To fetch details about a specific block (e.g., block number, transactions, timestamp), use the following commands:</p>
                            <h3>Commands to Get Block Info:</h3>
                            <ul>
                                <li><strong>"Get Block <span>[Block Number]</span>"</strong></li>
                                <li><strong>"Get Block Info of block number <span>[Block Number]</span>"</strong></li>
                                <li><strong>"Get Block <span>[Block Number]</span>on <span>[network name]</span>"</strong></li>
                                <li><strong>"Get Block Info of block number <span>[Block Number]</span>on <span>[network name]</span>"</strong></li>
                            </ul>
                        </div>
                    </section>
                    <section id="gas-fees-prompt">
                        <div className="docs-box">
                            <h1>Gas Fees with 0xXplorer Ai ⛽</h1>
                            <p>Gas fees are a critical aspect of blockchain transactions, and 0xXplorer Ai makes it easy to estimate, fetch, and optimize gas fees for your transactions. Whether you're sending ETH, interacting with smart contracts, or deploying dApps, here’s how you can manage gas fees effectively using 0xXplorer Ai.</p>
                            <h3>1. Fetch Current Gas Fees</h3>
                            <p>To fetch the current gas fee on the network, use the following commands:</p>
                            <ul>
                                <li><strong>"current gas fees on <span>[network name]</span>"</strong></li>
                                <li><strong>"What’s the current gas fee on <span>[network name]</span>?"</strong></li>
                            </ul>
                            <h3>2. Estimate Gas Fees for the Next Block</h3>
                            <p>To estimate the gas fee for a transaction in the next block, use the following commands:</p>
                            <h3>Commands to Estimate Gas Fees:</h3>
                            <ul>
                                <li><strong>"Estimate gas fee for next block on <span>[network name]</span>"</strong></li>
                                <li><strong>"EGet gas estimate for next block on <span>[network name]</span>"</strong></li>
                                <li><strong>"What’s the gas fee for the next block <span>[network name]</span>?"</strong></li>
                            </ul>
                            <h3>3. Fetching Fee History</h3>
                            <p>To fetch the fee history for a specific blockchain, use the following commands:</p>
                            <h3>Commands to Fetch Fee History:</h3>
                            <ul>
                                <li><strong>"Get fee history for <span>[network name]</span>"</strong></li>
                                <li><strong>"Show gas fee history for <span>[network name]</span>"</strong></li>
                                <li><strong>"What’s the fee history for <span>[network name]</span>?"</strong></li>
                            </ul>
                        </div>
                    </section>
                    <section id="real-time-data">
                        <div className="docs-box">
                            <h1>Real-Time Data with 0xXplorer Ai 📈</h1>
                            <p>0xXplorer Ai provides real-time data to keep you updated on cryptocurrency prices, the latest news, and more. Whether you're tracking market trends, staying informed about blockchain developments, or planning your next investment, here’s how you can access real-time data using 0xXplorer Ai.</p>
                            <h3>1. Fetch Current Cryptocurrency Prices</h3>
                            <p>To fetch the current price of a cryptocurrency, use the following commands:</p>
                            <ul>
                                <li><strong>"price of <span>[Currency Name or Symbol]</span>"</strong></li>
                                <li><strong>"current price of <span>[Currency Name or Symbol]</span>"</strong></li>
                                <li><strong>"what is current price of <span>[Currency Name or Symbol]</span>?"</strong></li>
                            </ul>
                            <h3>2. Fetch Latest News</h3>
                            <p>To fetch the latest news on blockchain, technology, finance, or global events, use the following commands:</p>
                            <h3>Commands to Fetch Latest News:</h3>
                            <ul>
                                <li><strong>"Get latest news"</strong></li>
                                <li><strong>"Show recent news"</strong></li>
                                <li><strong>"What’s the latest blockchain news?"</strong></li>
                            </ul>
                        </div>
                    </section>
                    <section id="contract-propmt">
                        <div className="docs-box">
                            <h1>Smart Contract Interaction with 0xXplorer Ai 🤖</h1>
                            <p>0xXplorer Ai empowers you to interact with smart contracts seamlessly. Whether you're fetching contract details, reading functions, compiling code, or deploying contracts, here’s a comprehensive guide on how to use 0xXplorer Ai for smart contract interactions.</p>
                            <h3>1. Fetch Contract ABI</h3>
                            <p>The Application Binary Interface (ABI) is a JSON file that defines how to interact with a smart contract. To fetch the ABI of a contract, use the following commands:</p>
                            <h3>Commands to Fetch Contract ABI:</h3>
                            <ul>
                                <li><strong>"Get ABI of <span>[Contract Address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"What's the ABI of <span>[Contract Address]</span> on <span>[network name]</span>?"</strong></li>
                            </ul>
                            <h3>2. Fetch Contract Source Code</h3>
                            <p>To fetch the source code of a verified contract, use the following commands:</p>
                            <h3>Commands to Fetch Contract Source Code:</h3>
                            <ul>
                                <li><strong>"Get source code of <span>[Contract Address]</span> on <span>[network name]</span>"</strong></li>
                                <li><strong>"What's the source code of <span>[Contract Address]</span> on <span>[network name]</span>?"</strong></li>
                            </ul>
                            <h3>3. Read Contract Functions</h3>
                            <p>To read data from a contract’s functions (e.g., fetching balances or states), use the following commands:</p>
                            <h3>Commands to Read Contract Functions:</h3>
                            <ul>
                                <li><strong>"Read function <span>[function name]</span> of <span>[contract Address]</span> on<span>[network name]</span>"</strong></li>
                                <li><strong>"What’s the result of<span>[function name]</span> of <span>[contract Address]</span> on<span>[network name]</span>"</strong></li>
                            </ul>
                            <h3>4. Compile a Contract</h3>
                            <p>To compile a smart contract, use the following commands:</p>
                            <h3>Commands to Compile a Contract:</h3>
                            <ul>
                                <li><strong>"Compile this contract:<span>[Solidity Code]</span>"</strong></li>
                                <li><strong>"Can you compile this contract?<span>[Solidity Code]</span>"</strong></li>
                            </ul>
                            <h3>5. Deploy a Contract</h3>
                            <p>To deploy a compiled contract to a blockchain network, use the following commands:</p>
                            <h3>Commands to Deploy a Contract:</h3>
                            <ul>
                                <li><strong>"Deploy this contract"</strong></li>
                                <li><strong>"Deploy this solidity <span>[solidity code]</span>"</strong></li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}