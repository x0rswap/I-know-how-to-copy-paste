import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/abi.json";



const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x14370784A7E0D23349154Eb0fA0b163d82fE2d60";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.all_messages();
        console.log("un", waves[0]);

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave[0],
            timestamp: new Date(wave[2] * 1000),
            message: wave[1],
            prime: wave[3].toString()
          });
        });

        /*
         * Store our data in React State
         */
        console.log(wavesCleaned);
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

function isP(x) {
  var y = Math.sqrt(x) + 2;
  if (x == 1) return false;
  for (var i = 2; i < Math.min(y, x); i++) {
    if (x % i == 0)
      return false;
  }
  return true;
}
function nextP(x) {
  while(!isP(x)) {
    x++;
  }
  return x;
}

const write = async() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let maxprime = await wavePortalContract.maxprime();
        var p = maxprime.toNumber();
        console.log("Maxprime:", p);
        //Find next prime
        var nextp = nextP(p+1);
        //Write with the next prime
        console.log("Next prime", nextp);
        var message = prompt("Your message ?");
        console.log("Message", message);
        var ssqrt = Math.floor(Math.sqrt(nextp))+2;
        console.log("sqrt", ssqrt)
        const waveTxn = await wavePortalContract.new_message(message, nextp, ssqrt);
        console.log("Mining...", waveTxn.hash);
        
        let newpp = await wavePortalContract.maxprime();
        var newp = newpp.toNumber();
        console.log("New maxprime:", newp);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  //



const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.maxprime();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])



  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hi
        </div>

        <div className="bio">
          Copied pasted of <a href="https://github.com/buildspace/buildspace-projects/tree/main/Solidity_And_Smart_Contracts/en">this</a>.
          <br/>
          You can write a message if you give a better prime :)
        </div>

        <button className="waveButton" onClick={
getAllWaves}>
          Update the list of messages !
        </button>
        
        <button className="waveButton" onClick={write}>
          Write a message :)
        </button>
        
        
        {allWaves.map((wave, index) => {
          console.log(wave);
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Prime used: {wave.prime}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App