import "./App.css";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useState, useEffect } from "react";
import styled from "styled-components";

import WalletCard from './WalletCard';
import Coinbase from "./coinbase";
import WalletLink from "./WalletLink";

  function App(){
  return (
    <div className="App">
      <Coinbase/>
    <WalletCard/>
    <WalletLink/>
    
    </div>
    
  );
}

export default App;