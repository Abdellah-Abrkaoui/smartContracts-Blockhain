import { useState, useEffect } from "react";
import Web3 from "web3";
import HelloWorldContract from "./contracts/HelloWorld.json";
import "./ContractInteraction.css";

function ContractInteraction() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [gasUsed, setGasUsed] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [networkId, setNetworkId] = useState("");

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      // Connect to Ganache
      const web3Instance = new Web3("http://127.0.0.1:7545");
      setWeb3(web3Instance);

      // Get accounts
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      // Get network ID
      const netId = await web3Instance.eth.net.getId();
      setNetworkId(netId.toString());

      // Get current block number
      const block = await web3Instance.eth.getBlockNumber();
      setBlockNumber(block.toString());

      // Get deployed contract
      const deployedNetwork = HelloWorldContract.networks[netId];
      const contractInstance = new web3Instance.eth.Contract(
        HelloWorldContract.abi,
        deployedNetwork.address
      );
      setContract(contractInstance);

      // Get initial name
      const name = await contractInstance.methods.yourName().call();
      setCurrentName(name);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing Web3:", error);
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!newName || !contract) return;

    setLoading(true);
    setShowSuccess(false);

    try {
      // Send transaction
      const receipt = await contract.methods
        .setName(newName)
        .send({ from: account });

      // Get updated name
      const updatedName = await contract.methods.yourName().call();
      setCurrentName(updatedName);

      // Set transaction details
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed.toString());
      setBlockNumber(receipt.blockNumber.toString());

      // Clear input
      setNewName("");

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setLoading(false);
    } catch (error) {
      console.error("Error setting name:", error);
      setLoading(false);
    }
  };

  if (loading && !contract) {
    return (
      <div className="app-container">
        <div className="animated-bg">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <p>Connecting to Blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header Section */}
        <header className="header">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <rect width="50" height="50" rx="12" fill="url(#gradient1)" />
                <path
                  d="M15 25L22 32L35 18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="50" y2="50">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Smart Contracts</h1>
              <p className="subtitle">Decentralized Identity on Ethereum</p>
            </div>
          </div>

          <div className="network-badge">
            <span className="status-dot"></span>
            <span>Ganache Network</span>
          </div>
        </header>

        {/* Info Cards */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <span className="info-label">Connected Account</span>
              <span className="info-value">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📦</div>
            <div className="info-content">
              <span className="info-label">Block Number</span>
              <span className="info-value">#{blockNumber}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">⛽</div>
            <div className="info-content">
              <span className="info-label">Last Gas Used</span>
              <span className="info-value">{gasUsed || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <div className="greeting-section">
            <div className="greeting-header">
              <h2>Your Blockchain Identity</h2>
              <p className="greeting-subtitle">
                Stored permanently on the Ethereum blockchain
              </p>
            </div>

            <div className="greeting-display">
              <span className="greeting-text">Hello</span>
              <span className="greeting-name">{currentName}</span>
              <span className="greeting-emoji">👋</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Success Message */}
          {showSuccess && (
            <div className="success-alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#10b981" />
                <path
                  d="M6 10L9 13L14 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Transaction successful! Your name has been saved to the
                blockchain.
              </span>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            <label className="input-label">
              <span>Set Your Name</span>
              <span className="label-badge">Write to Blockchain</span>
            </label>

            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter your name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="name-input"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && handleSetName()}
              />
              <button
                onClick={handleSetName}
                className="set-name-btn"
                disabled={loading || !newName}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Set Name</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 10h12m0 0l-4-4m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <p className="input-hint">
              💡 This will create a transaction on the blockchain and cost gas
            </p>
          </div>

          {/* Transaction Info */}
          {txHash && (
            <div className="tx-info">
              <div className="tx-header">
                <span className="tx-title">Latest Transaction</span>
                <span className="tx-status">✓ Confirmed</span>
              </div>
              <div className="tx-details">
                <div className="tx-row">
                  <span className="tx-label">Hash:</span>
                  <span className="tx-value">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(txHash);
                      alert("Transaction hash copied!");
                    }}
                    title="Copy transaction hash"
                  >
                    📋
                  </button>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Block:</span>
                  <span className="tx-value">#{blockNumber}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Gas Used:</span>
                  <span className="tx-value">{gasUsed} wei</span>
                </div>
              </div>
            </div>
          )}

          {/* Contract Info */}
          <div className="contract-info">
            <h3>Smart Contract Details</h3>
            <div className="contract-details">
              <div className="detail-row">
                <span className="detail-label">Network ID:</span>
                <span className="detail-value">{networkId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Contract Address:</span>
                <span className="detail-value">
                  {contract?._address
                    ? `${contract._address.slice(
                        0,
                        10
                      )}...${contract._address.slice(-8)}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>Built with ❤️ using Truffle, Ganache, Web3.js and React</p>
            <div className="footer-links">
              <a
                href="https://trufflesuite.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Truffle Documentation
              </a>
              <span>•</span>
              <a
                href="https://web3js.readthedocs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Web3.js Docs
              </a>
              <span>•</span>
              <a
                href="https://soliditylang.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Solidity
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ContractInteraction;
