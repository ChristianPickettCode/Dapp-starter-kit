import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'

import { Button } from './Button'

declare let window: any;

const Home: NextPage = () => {

  const [greeting, setGreetingState] = useState('');
  const [newGreeting, setNewGreetingState] = useState('');
  const [newGreetingMessage, setNewGreetingMessageState] = useState('');
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('');
  const newGreetingInputRef = useRef();
  useEffect(() => {
    if(!hasEthereum()) {

    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const signerAddress = await signer.getAddress();
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`);
      } catch {
        setConnectedWalletAddressState('No wallet connected');
        return;
      }
    }
    setConnectedWalletAddress();
    return () => {}
  }, []);

  async function requestAddress() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if(!hasEthereum) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, provider);
    try {
      const data = await contract.greet();
      setGreetingState(data);
    } catch(error) {
      console.log(error);
    }
  }

  async function setGreeting() {
    if(!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    if(! newGreeting ) {
      setNewGreetingMessageState('Add a new greeting first.');
      return;
    }
    await requestAddress();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    setConnectedWalletAddressState(`Connect wallet: ${signerAddress}`);
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, signer);
    const transaction = await contract.setGreeting(newGreeting);
    await transaction.wait();
    setNewGreetingMessageState(`Greeting updated to ${newGreeting} from ${greeting}.`);
    setNewGreetingState('');
  }

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Dapp Starter Kit</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        { ! process.env.NEXT_PUBLIC_GREETER_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_GREETER_ADDRESS</pre> environment variable.
            </p>
        ) : (
          <>
            <h1 className="text-6xl font-semibold mb-8 underline">
              Dapp Starter Kit
            </h1>
            <h3 className="text-4l font-semibold mb-8">
              Solidity | Next.js | Hardhat | Typescript | TailwindCSS
            </h3>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="A fetched greeting will show here"
                    value={greeting}
                    disabled
                  />
                  <Button onClick={fetchGreeting} text="Fetch greeting from the blockchain"/>
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col space-y-4">
                    <input
                      className="border p-4 text-center"
                      onChange={ e => setNewGreetingState(e.target.value)}
                      placeholder="Write a new greeting"
                      ref={newGreetingInputRef}
                    />
                    <Button onClick={setGreeting} text="Set new greeting on the blockchain" />
                    <div className="h-2">
                      { newGreetingMessage && <span className="text-sm text-gray-500 italic">{newGreetingMessage}</span> }
                    </div>
                  </div>
                </div>
                <div className="h-4">
                  { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
                </div>
            </div>
          </>
        ) }
      </main>

      <footer className="mt-20">
        <a
          href="https://github.com/tomhirst/solidity-nextjs-starter/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Forked From
        </a>
      </footer>
    </div>
  )
}

export default Home
