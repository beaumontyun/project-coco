import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Handsoff from '../src/artifacts/contracts/MyNFT.sol/Handsoff.json';

// const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const contractAddress = `${process.env.REACT_APP_CONTRACT_ADDRESS}`

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract - "abi" = application binary interface for react to communicate to the smart contract
const contract = new ethers.Contract(contractAddress, Handsoff.abi, signer);

// ethers.js make a reference to the deployed contract. We request the total number of minted tokens, then create a loop to render a child component for each one.

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
        <WalletBalance />

        {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
            <div key={i}>
            <NFTImage tokenId={i} getCount={getCount} />
            </div>
        ))}
    </div>
  );
}

// Mint a new token:
// It first makes a reference to the metadata URI. 
// When the mint button is clicked it connects the user’s wallet to the smart contact on the blockchain, 
// then mints a new token using the payToMint method we defined in the Solidity code.
function NFTImage({ tokenId, getCount }) {
    const contentId = `${process.env.REACT_APP_CONTENT_ID}`;
    const metadataURI = `${contentId}/${tokenId}.json`;
    // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
    const imageURI = `../src/img/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div>
        <img src={isMinted ? imageURI : '../src/img/placeholder.png'} style={{
          width: 200,
          height: 200,
        }}></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }

export default Home;