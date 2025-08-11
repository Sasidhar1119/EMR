// src/utils/blockchain.js
import Web3 from "web3";
import HealthSystemABI from "./HealthSystem.json"; // Make sure this file is copied to src/utils/

export async function getWeb3() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  }
  alert("Please install MetaMask!");
  return null;
}

export async function getContract(web3) {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = HealthSystemABI.networks[networkId];
  if (!deployedNetwork) {
    throw new Error("Contract not deployed on the current network.");
  }
  return new web3.eth.Contract(
    HealthSystemABI.abi,
    deployedNetwork.address
  );
}
