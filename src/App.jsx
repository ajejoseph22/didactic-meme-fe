import React, { useEffect, useState } from "react";
import ConnectButton from "./components/connect-btn";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import abi from "../utils/abi.json";

import "./App.css";

const getEthereumObject = () => window.ethereum;

const CONTRACT_ADDRESS = "0xb2d6bBd3fC1fe4E9f945144DAD980de693757984";
const CONTRACT_ABI = abi.abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [wavePortalContract, setWavePortalContract] = useState({});
  const [totalWaves, setTotalWaves] = useState(0);
  const [loading, setLoading] = useState(true);

  const isFirstRender = React.useRef(true);

  /*
   * This function returns the first linked account found.
   * If there is no account linked, it will return null.
   */
  const findMetaMaskAccount = async () => {
    try {
      const ethereum = getEthereumObject();

      /*
       * First make sure we have access to the Ethereum object.
       */
      if (!ethereum) {
        toast.error("Make sure you have Metamask!");
        return null;
      }

      console.log("We have the Ethereum object", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      // Set WavePortalContract to state
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log("Contract: ", contract);
      setWavePortalContract(
        contract
      );

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);

        return account;
      } else {
        toast.error(
          "No authorized account found. Please connect your MetaMask account.",
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalWaves = async () => {
    console.log("wavePortalContract", wavePortalContract);
    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    setTotalWaves(count.toNumber());

    return count.toNumber();
  };

  useEffect(async () => {
    const account = await findMetaMaskAccount();

    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  useEffect(async () => {
    // skip first render
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    setTotalWaves(await getTotalWaves());
    setLoading(false)
  }, [wavePortalContract]);

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        await getTotalWaves()

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave();
        setLoading(true)
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        toast.success("Success", );

        await getTotalWaves()
        setLoading(false)
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="main-container">
      <div className="data-container">
        <ConnectButton connected={!!currentAccount} connectFn={connectWallet} />

        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I'm Joseph and I build software for a living. That's pretty cool,
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="wave-btn" disabled={loading} onClick={wave}>
          Wave at Me
        </button>
        {currentAccount && !loading && <p className="total-waves">Total number of waves: {totalWaves}</p>}
        {currentAccount && loading && <p className="total-waves">Loading...</p>}
      </div>
    </div>
  );
}
