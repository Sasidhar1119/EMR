import React, { useEffect, useState } from "react";
import '../css/PatientReports.css';
import { getWeb3, getContract } from "../utils/blockchain";
import { uploadFileToPinata } from "../utils/pinata";
import Navbar from "./Navbar";

const PatientReports = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [files, setFiles] = useState([]); // Array of files
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadDoctors() {
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

        const allDoctors = await contractInstance.methods.getAllRegisteredDoctors().call();
        const approvedDoctors = [];

        for (const doctorAddrRaw of allDoctors) {
          const doctorAddr = web3.utils.toChecksumAddress(doctorAddrRaw);
          if (!web3.utils.isAddress(doctorAddr)) continue;

          // Check if doctor is approved by patient (account)
          const approved = await contractInstance.methods.isApproved(accounts[0], doctorAddr).call();
          if (approved) {
            const details = await contractInstance.methods.getDoctorDetails(doctorAddr).call();
            approvedDoctors.push({
              address: doctorAddr,
              firstName: details.firstName,
              lastName: details.lastName,
            });
          }
        }
        setDoctors(approvedDoctors);
        if (approvedDoctors.length > 0) setSelectedDoctor(approvedDoctors[0].address);
      } catch (err) {
        console.error(err);
        setStatus("Failed to load doctors.");
      }
    }
    loadDoctors();
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

  const sendReports = async () => {
    if (!contract || !account) {
      setStatus("Connect wallet first.");
      return;
    }
    if (files.length === 0) {
      setStatus("Please select at least one report file.");
      return;
    }
    if (!selectedDoctor) {
      setStatus("Please select a doctor.");
      return;
    }
    setStatus("Uploading reports to IPFS...");
    try {
      for (const file of files) {
        const ipfsHash = await uploadFileToPinata(file);
        setStatus(`Sending "${file.name}" hash on-chain...`);
        await contract.methods.sendReport(selectedDoctor, ipfsHash).send({ from: account });
      }
      setStatus("All reports sent successfully.");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send reports.");
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div className="container-patientreports">
        <h2 className="title-patientreports">Send Health Report</h2>

        <div className="upload-header">
          <label htmlFor="file-upload" className="custom-file-upload">
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Choose Report Files"}
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

        <label htmlFor="doctorSelect" className="select-label">Select Doctor:</label>
        <select
          id="doctorSelect"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="doctor-select"
        >
          {doctors.map((doctor) => (
            <option key={doctor.address} value={doctor.address}>
              Dr. {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>

        <button 
          className="btn-send-report"
          onClick={sendReports} 
          disabled={files.length === 0 || !selectedDoctor}
          title={files.length === 0 ? "Select report files" : !selectedDoctor ? "Select a doctor" : "Send reports"}
        >
          Send Report
        </button>

        {status && <p className="status-message">{status}</p>}
      </div>
    </>
  );
};

export default PatientReports;
