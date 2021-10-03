import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MetaTags from "../components/MetaTags";
import myEpicNft from "../utils/MyEpicNFT.json";

const CONTRACT_ADDRESS = "0x46D2DB5c06c0d351046c9634745F52fCE577F46e";

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Checks if we are authorized to access the user's wallet

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        setMining(true);

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );

        setMining(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="flex flex-1 w-full min-h-screen overflow-auto text-white bg-gray-800 font-sans ">
      <MetaTags />
      {/* test */}
      <div className="max-w-xl mx-auto my-auto py-20 px-3">
        <h1 className="text-4xl font-bold text-center pb-5">
          Need a Weapon? Each Weapon NFT is unique to you and only you. ⚔️
        </h1>
        <div className="text-lg leading-5 font-extralight text-center max-w-sm pb-5 mx-auto">
          Connect your Ethereum Wallet and create your unique Weapon NFT now!
        </div>

        <div className="pb-5">
          {!currentAccount && (
            <button
              className="border-white rounded-md border w-full py-2 text-lg font-bold"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div>
          {!mining ? (
            <div>
              <div className="pb-5 space-y-2 w-full">
                <button
                  onClick={askContractToMintNft}
                  type="submit"
                  className="border-white rounded-md border w-full py-2 text-lg"
                >
                  🗡 Mint My NFT Weapon 🏹
                </button>
              </div>
              <div className="text-xs text-red-300 text-center">
                Disclaimer: This is only available on the Rinkeby Test Network!
                Use at your own risk.
              </div>
            </div>
          ) : (
            <div className="pb-5 text-red-300 text-4xl font-bold text-center">
              Mining in Progress. Be Patient...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
