import React, { useEffect, useState } from "react";
import '../css/DoctorPrecautions.css';
import { getWeb3, getContract } from "../utils/blockchain";
import { uploadFileToPinata } from "../utils/pinata";
import Navbar from "./Navbar";

const DoctorPrecautions = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [patients, setPatients] = useState([]);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const web3 = await getWeb3();
        if (!web3) {
          setStatus("Please install MetaMask.");
          return;
        }
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          setStatus("Please connect MetaMask wallet.");
          return;
        }
        setAccount(accounts[0]);
        const contractInstance = await getContract(web3);
        setContract(contractInstance);

        const allPatients = await contractInstance.methods.getAllRegisteredPatients().call();
        const approvedPatients = [];

        for (const patientAddrRaw of allPatients) {
          const patientAddr = web3.utils.toChecksumAddress(patientAddrRaw);
          if (!web3.utils.isAddress(patientAddr)) continue;

          const approved = await contractInstance.methods.isApproved(patientAddr, accounts[0]).call();
          if (approved) {
            const details = await contractInstance.methods.patients(patientAddr).call();
            approvedPatients.push({
              address: patientAddr,
              firstName: details.firstName,
              lastName: details.lastName,
            });
          }
        }
        setPatients(approvedPatients);
      } catch (err) {
        console.error(err);
        setStatus("Failed to load patients.");
      }
    }
    loadPatients();
  }, []);

  const formatFileSize = (size) => {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    else return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setStatus("");
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendPrescriptions = async (patientAddress) => {
    if (!contract || !account) {
      setStatus("Connect wallet first.");
      return;
    }
    if (files.length === 0) {
      setStatus("Please select at least one prescription file.");
      return;
    }
    setStatus("Uploading prescriptions to IPFS...");
    try {
      for (const file of files) {
        const ipfsHash = await uploadFileToPinata(file);
        setStatus(`Sending "${file.name}" hash on-chain...`);
        await contract.methods.sendPrescription(patientAddress, ipfsHash).send({ from: account });
      }
      setStatus("All prescriptions sent successfully.");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send prescriptions.");
    }
  };

  return (
    <>
      <Navbar role="doctor" />
      <div className="container-doctorprecautions">
        <h2 className="title-doctorprecautions">Send Prescription / Precautions</h2>

        <div className="upload-header">
          <label htmlFor="file-upload" className="browse-btn">
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Choose Prescription Files"}
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png,.doc,.docx"
          />
        </div>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, idx) => (
              <li key={idx} className="file-item">
                <span className="file-name" title={file.name}>{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
                <button className="file-remove" onClick={() => removeFile(idx)} aria-label="Remove file">&times;</button>
              </li>
            ))}
          </ul>
        )}

        {patients.length === 0 ? (
          <p className="no-patients">No approved patients available.</p>
        ) : (
          <ul className="patient-list">
            {patients.map((patient) => (
              <li key={patient.address} className="patient-card">
                <div className="patient-name">{patient.firstName} {patient.lastName}</div>
                <button
                  className="btn-send"
                  onClick={() => sendPrescriptions(patient.address)}
                  disabled={files.length === 0}
                  title={files.length === 0 ? "Select files first" : `Send prescriptions to ${patient.firstName}`}
                >
                  Send
                </button>
              </li>
            ))}
          </ul>
        )}

        {status && <p className="status-message">{status}</p>}
      </div>
    </>
  );
};

export default DoctorPrecautions;
