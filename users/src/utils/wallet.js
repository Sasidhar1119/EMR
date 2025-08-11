// src/utils/wallet.js
import Web3 from "web3";

let web3Instance = null;
let currentAccount = null;

/**
 * Connects to MetaMask wallet and returns web3 instance and account.
 * Always requests accounts to ensure fresh connection.
 */
export async function connectWallet() {
  if (window.ethereum) {
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts.length) throw new Error("No accounts found");

      // Create or reuse web3 instance
      if (!web3Instance) {
        web3Instance = new Web3(window.ethereum);
      }

      currentAccount = accounts[0];
      return { web3: web3Instance, account: currentAccount };
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  } else {
    alert("Please install MetaMask!");
    throw new Error("MetaMask not installed");
  }
}

/**
 * Disconnect wallet by clearing cached data.
 * Note: MetaMask does not support programmatic disconnect,
 * so this is app-level clearing.
 */
export function disconnectWallet() {
  web3Instance = null;
  currentAccount = null;
}
