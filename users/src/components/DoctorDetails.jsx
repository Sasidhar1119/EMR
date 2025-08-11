import React, { useEffect, useState, useCallback } from "react";
import '../css/DoctorDetails.css';
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";

const POLL_INTERVAL_MS = 10000; // Poll every 10 seconds

const DoctorDetails = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meetingStatus, setMeetingStatus] = useState({}); // doctorAddress -> "none"|"applied"

  // Helper to get request key hash
  const getRequestKey = (patient, doctor) => {
    return window.web3.utils.keccak256(window.web3.eth.abi.encodeParameters(['address', 'address'], [patient, doctor]));
  };

  // Load doctors and meeting status
  const loadDoctorsAndStatus = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
      if (!doctorAddresses.length) {
        setDoctors([]);
        setLoading(false);
        return;
      }

      const doctorDetailsList = await Promise.all(
        doctorAddresses.map(async (addr) => {
          try {
            const details = await contract.methods.getDoctorDetails(addr).call();
            return { ...details, walletAddress: addr };
          } catch (err) {
            console.error("Error fetching doctor details for", addr, err);
            return null;
          }
        })
      );

      setDoctors(doctorDetailsList.filter(Boolean));

      // Determine meeting status for each doctor
      const statusObj = {};
      await Promise.all(
        doctorAddresses.map(async (addr) => {
          try {
            const reqKey = getRequestKey(account, addr);
            const request = await contract.methods.requests(reqKey).call();
            const isApproved = await contract.methods.isApproved(account, addr).call();

            if (request.exists && !isApproved) {
              // Request exists but not approved yet
              statusObj[addr] = "applied";
            } else {
              // No request or approved (meeting done)
              statusObj[addr] = "none";
            }
          } catch (err) {
            statusObj[addr] = "none";
          }
        })
      );
      setMeetingStatus(statusObj);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setError("Failed to load doctors.");
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    async function setup() {
      try {
        const web3 = await getWeb3();
        if (!web3) {
          setError("Please install MetaMask.");
          setLoading(false);
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          setError("Please connect MetaMask wallet.");
          setLoading(false);
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = await getContract(web3);
        setContract(contractInstance);
      } catch (err) {
        setError("Failed to initialize.");
        setLoading(false);
      }
    }
    setup();
  }, []);

  // Load doctors and status once contract and account are ready
  useEffect(() => {
    if (contract && account) {
      loadDoctorsAndStatus();

      // Poll for status updates every 10 seconds
      const interval = setInterval(() => {
        loadDoctorsAndStatus();
      }, POLL_INTERVAL_MS);

      return () => clearInterval(interval);
    }
  }, [contract, account, loadDoctorsAndStatus]);

  const applyForMeeting = async (doctorAddress) => {
    if (!contract || !account) {
      alert("Connect your wallet first.");
      return;
    }
    try {
      await contract.methods.requestConsultation(doctorAddress).send({ from: account });
      // Update local state to show "Applied"
      setMeetingStatus((prev) => ({ ...prev, [doctorAddress]: "applied" }));
      // No alert popup as requested
    } catch (err) {
      console.error("Error sending meeting request:", err);
      alert("Failed to send meeting request.");
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div className="container-doctordetails">
        <h2 className="title-doctordetails">Available Doctors</h2>
        {loading && <p className="loading">Loading doctors...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <>
            {doctors.length === 0 ? (
              <p className="no-doctors">No doctors available.</p>
            ) : (
              <div className="doctors-grid small">
                {doctors.map((doc, idx) => {
                  const status = meetingStatus[doc.walletAddress] || "none";
                  return (
                    <div key={idx} className="card-doctordetails small">
                      <div className="doctor-card-header">
                        <div className="doctor-avatar">
                          <span role="img" aria-label="Doctor" style={{ fontSize: "2rem" }}>🩺</span>
                        </div>
                        <div>
                          <h3>Dr. {doc.firstName} {doc.lastName}</h3>
                          <div className="doctor-specialization">{doc.specialization}</div>
                        </div>
                      </div>
                      <div className="doctor-card-body">
                        <div><strong>Email:</strong> {doc.email}</div>
                        <div><strong>Phone:</strong> {doc.phoneNumber}</div>
                        <div><strong>Clinic Address:</strong> {doc.YearsExperience}</div>
                        <div><strong>Experience:</strong> {doc.Doctoraddress} years</div>
                        <div><strong>License No:</strong> {doc.licensenumber}</div>
                      </div>
                      <div className="doctor-card-footer">
                        {status === "none" && (
                          <button
                            className="btn-apply"
                            onClick={() => applyForMeeting(doc.walletAddress)}
                          >
                            Apply for Meeting
                          </button>
                        )}
                        {status === "applied" && (
                          <button className="btn-applied" disabled>
                            Applied (Waiting for Doctor)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DoctorDetails;
