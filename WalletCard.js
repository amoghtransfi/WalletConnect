import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import './WalletCard.css'
import './WalletLink.css'

const WalletConnect = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [provider, setProvider] = useState(null);

	const connectWalletHandler = () => {
		window.ethereum.autoRefreshOnNetworkChange=false
		if (window.ethereum.isMetaMask && defaultAccount == null) {
			// set ethers provider
			//setProvider(new ethers.providers.Web3Provider(window.ethereum));
			setProvider(new ethers.providers.Web3Provider(window.ethereum));
			console.log(window.ethereum.providers.find(({ isMetaMask }) => isMetaMask))
			
			
			window.ethereum.providers.find(({ isMetaMask }) => isMetaMask).request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnButtonText('Wallet Connected');
				setDefaultAccount(result[0]);
				
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

useEffect(() => {
	if(defaultAccount){
	provider.getBalance(defaultAccount)
	.then(balanceResult => {
		setUserBalance(ethers.utils.formatEther(balanceResult));
	})
	};
}, [defaultAccount]);
	
	return (
		<div className='walletCard'>
		<h4> Connection to Metamask</h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
			{errorMessage}
		</div>
	);
}

export default WalletConnect;