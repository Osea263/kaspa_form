import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, Card, Input, Radio } from 'antd'; 
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; 
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyC2MinEapjIY4eOp7DFSXans3Ne6qUjaPM",
//   authDomain: "kalala-c01c5.firebaseapp.com",
//   projectId: "kalala-c01c5",
//   storageBucket: "kalala-c01c5.appspot.com",
//   messagingSenderId: "394719457612",
//   appId: "1:394719457612:web:cf86a6129706e7f2695fe9",
//   measurementId: "G-H7EPB5PHZM"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = firebase.firestore();
// const analytics = getAnalytics(app);



function App() {
  const [kaswareInstalled, setKaswareInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]); 
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0
  });
  const [network, setNetwork] = useState('kaspa_mainnet'); 

  const getBasicInfo = async () => {
    const kasware = (window as any).kasware;
    const [address] = await kasware.getAccounts();
    setAddress(address);

   

    const balance = await kasware.getBalance();
    setBalance(balance);
    const krc20Balances = await kasware.getKRC20Balance();
    console.log('krc20Balances', krc20Balances);

    const network = await kasware.getNetwork();
    setNetwork(network);
  };

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: []
  });
  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };

  const handleNetworkChanged = (network: string) => {
    console.log('network', network);
    setNetwork(network);
    getBasicInfo();
  }; 

  useEffect(() => {
    async function checkKasware() {
      let kasware = (window as any).kasware;

      for (let i = 1; i < 10 && !kasware; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * i));
        kasware = (window as any).kasware;
      }

      if (kasware) {
        setKaswareInstalled(true);
      } else if (!kasware) return;

      kasware.getAccounts().then((accounts: string[]) => {
        handleAccountsChanged(accounts);
      });

      kasware.on('accountsChanged', handleAccountsChanged);
      kasware.on('networkChanged', handleNetworkChanged); 

      return () => {
        kasware.removeListener('accountsChanged', handleAccountsChanged);
        kasware.removeListener('networkChanged', handleNetworkChanged); 
      };
    }

    checkKasware().then();
  }, []);
   
  const [twitterUsername, setTwitterUsername] = useState('');
  const [telegramUsername, settelegramUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');

  // database 
  const dbref = collection(db, "userData")
  

  const send = async () => {
    try {
      
      await addDoc(dbref, {TwitterUsername:twitterUsername, TelegramUsername:telegramUsername, AccessCode:accessCode, KaspaAddress:address})
      alert("Message Send Successfully")
    } catch (error) {
      alert("Error")
    }
  }

  // const handleSubmit = () => {
    
  //   db.collection("airdrop_entries").add(
  //     {
  //       TwitterUsername:twitterUsername,
  //       TelegramUsername:telegramUsername,
  //        AccessCode:accessCode,
  //         KaspaAddress:address
  //     }
  //   )
  //   .then(() =>{ alert("Message submitted")})
  //   .catch((error) =>{
  //     alert(error.message)
  //   })
  // }



  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('Twitter username:', twitterUsername);
    console.log('Kas wallet address:', telegramUsername);
    console.log('Access code:', accessCode);
    console.log("Kaspa address", address)
    const userRef = db.collection('airdrop_entries').doc(); // Create a new document
     await userRef.set({
    twitterUsername,
    telegramUsername,
    accessCode, 
    address,
  });

  setTwitterUsername("")
  settelegramUsername("")
  setAccessCode("")

  alert('Data Submitted Successfully');
    // Add any logic to handle form submission here
  };

  if (!kaswareInstalled) {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Button
              onClick={() => {
                window.location.href = 'https://kasware.xyz';
              }}>
              Install Kasware Wallet
            </Button>
          </div>
        </header>
      </div>
    );
  }
  const kasware = (window as any).kasware;
  return (
    <div className="App">
      <header className="App-header">
        <p>𐤊asala - The Dog</p>

        {connected ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <Button
              onClick={async () => {
                const origin = window.location.origin;
                await kasware.disconnect(origin);
                handleAccountsChanged([]);
              }}>
              Disconnect 𐤊asware Wallet
            </Button>
            <Card size="small" title="Wallet Info" style={{ width: 300, margin: 10 }}>
              <div style={{ textAlign: 'left', marginTop: 10 }}>
                <div style={{ fontWeight: 'bold' }}>Address:</div>
                <div style={{ wordWrap: 'break-word' }}>{address}</div>
              </div> 

              <div style={{ textAlign: 'left', marginTop: 10 }}>
                <div style={{ fontWeight: 'bold' }}>Balance: ($𐤊AS)</div>
                <div style={{ wordWrap: 'break-word' }}>{balance.total}</div>
              </div>
            </Card> 
         
            <Card size="small" title="𐤊asala Airdrop" style={{ width: 300, margin: 10 }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <a href="https://x.com/intent/follow?screen_name=kasala_dog" target="_blank" rel="noreferrer noopener" className="twitter-redirect-button">
                Follow X
                </a>
                <Input type="text" id="twitter-username" required placeholder="Enter your X username" value={twitterUsername} onChange={(e) => setTwitterUsername(e.target.value)} />
                
              </div>
              <div className="form-group">
                <label htmlFor="kas-wallet">Telegram Username</label>
                <a href="https://t.me/KasalaDogs" target="_blank" rel="noreferrer noopener" className="telegram-redirect-button">
                Join Telegram
                </a>
                <Input type="text" id="telegram-username" required placeholder="Enter Telegram username" value={telegramUsername} onChange={(e) => settelegramUsername(e.target.value)} />
              </div>

            
              <div className="form-group2">
                <label htmlFor="access-code">Enter DOG Code</label>
                <Input type="text" id="access-code" placeholder="" required value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
              </div>
              <img src="./5.png" alt="Icon" ></img>
              <button type="submit" className="btn btn-primary" >SUBMIT</button>
            </form>
             </Card> 
          </div>

        ) : (
          <div>
            <Button
              onClick={async () => {
                const result = await kasware.requestAccounts();
                handleAccountsChanged(result);
              }}>
              Connect Kasware Wallet
            </Button>
          </div>
        )}
      </header>
    </div>
  );
} 

export default App;
