import React, { useEffect, useState } from "react";
import ConnectButton from "./components/connect-btn";
import { toast } from "react-toastify";

import "./App.css";

const getEthereumObject = () => window.ethereum;

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

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

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
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(async () => {
    const account = await findMetaMaskAccount();

    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  const wave = () => {};

  return (
    <div className="main-container">
      <div className="data-container">
        <ConnectButton connected={!!currentAccount} connectFn={connectWallet} />

        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I'm Joseph and I build software for a living. That's pretty cool,
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="wave-btn" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
