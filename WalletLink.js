//import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import React, {useState, useEffect} from 'react'
import { ethers } from "ethers";
import { SUPPORTED_NETWORKS } from "./helpers/networks";
 

 

const WalletLink =() =>{
    const [connector, setConnector] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [account, setAccount] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);
  const [network, setNetwork] = useState(null);
  const [symbol, setSymbol] = useState(null);
    useEffect(() => {
        const onConnect = async (chainId, connectedAccount) => {
          setAccount(connectedAccount);
          setChainId(chainId);
    
          // get chain data
          const networkData = SUPPORTED_NETWORKS.filter(
            (chain) => chain.chain_id === chainId
          )[0];
    
          if (!networkData) {
            setSupported(false);
          } else {
            setSupported(true);
            setNetwork(networkData.name);
            setSymbol(networkData.native_currency.symbol);
    
            // get account balance
            let provider = new ethers.providers.StaticJsonRpcProvider(
              networkData.rpc_url,
              {
                chainId,
                name: networkData.name,
              }
            );
    
            let balance = await provider.getBalance(connectedAccount);
            let formattedBalance = ethers.utils.formatEther(balance);
    
            setBalance(formattedBalance);
          }
        };
    
        const refreshData = async () => {
          const { chainId, accounts } = connector;
          await onConnect(chainId, accounts[0]);
          setFetching(false);
        };
    
        if (connector) {
          connector.on("connect", async (error, payload) => {
            const { chainId, accounts } = payload.params[0];
            await onConnect(chainId, accounts[0]);
            setFetching(false);
          });
    
          connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            }
            resetApp();
          });
    
          if ((!chainId || !account || !balance) && connector.connected) {
            refreshData();
          }
        }
      }, [connector, balance, chainId, account]);
    
      const connect = async () => {
        setFetching(true);
    
        // bridge url
        const bridge = "https://bridge.walletconnect.org";
    
        // create new connector
        const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
        setConnector(connector);
    
    
        if (!connector.connected) {
          // create new session
          connector.createSession().then(() => {
            // get uri for QR Code modal
            const uri = connector.uri;
            // display QR Code modal
            QRCodeModal.open(
              uri,
              () => {
                console.log("QR Code Modal closed");
              },
              true // isNode = true
            );
          });}
    
        // check if already connected
       // if (!connector.connected && connector != null) {
          // create new session
    
         // await connector.createSession();
       // }
      };
    
      // this ensures the connection is killed on the users mobile device
      const killSession = () => {
        if (connector) {
          connector.killSession();
        }
        resetApp();
      };
    
      const sendTransaction = async () => {
        try {
          setError(null);
          await connector.sendTransaction({
            from: account,
            to: account,
            value: "0x1BC16D674EC80000",
          });
        } catch (e) {
          setError(e.message);
        }
      };
      
    
      const resetApp = () => {
        setConnector(null);
        setChainId(null);
        setAccount(null);
        setFetching(false);
        setBalance(null);
        setError(null);
      };
    

  return(
    <div className="walletlink">
        <h4>Connection to WalletConnect</h4>
        <button onClick={connect}>{"Connect Wallet"}</button>
			<div className='accountDisplay'>
				<h3>Address: {account}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {balance}</h3>
			</div>
			{error}
    </div>
  )
}
export default WalletLink;