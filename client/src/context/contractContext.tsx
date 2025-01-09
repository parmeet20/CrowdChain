import { ethers } from "ethers";
import React, { createContext, useState, useEffect, useContext } from "react";
import ABI from "./../CrowdFunding.json"; // Import the ABI for your contract
import { contractAddress } from "@/assets/contractAddress";

// Define the structure of the Campaign
interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: number;
  fundRaised: number;
  owner: string;
  isClosed: boolean;
}

// Define contract context
interface ContractContextInterface {
  contract: ethers.Contract | null;
  createCampaign: (name: string, description: string, goal: string) => void;
  fundCampaign: (campaignId: number, amount: string) => void;
  getAllCampaigns: () => void;
  getCampaign: (id: number) => void;
  withdrawFunds: (id: number) => void;
  campaigns: Campaign[];
  loading: boolean;
  isContractReady: boolean;
  account: string | null;
  connectWallet: () => void;
}

const ContractContext = createContext<ContractContextInterface | undefined>(undefined);

interface ContractProviderProps {
  children: React.ReactNode;
}

const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContractReady, setIsContractReady] = useState(false);
  const [account, setAccount] = useState<string | null>(null); 
  const InitContract = async () => {
    if (!window.ethereum) {
      console.error("Ethereum object not found. Please install MetaMask.");
      return;
    }

    const _provider = new ethers.BrowserProvider(window.ethereum);

    const _signer = await _provider.getSigner();
    setSigner(_signer);

    const _contract = new ethers.Contract(
      contractAddress,
      ABI.abi,
      _signer     );
    setContract(_contract);

    fetchCampaigns(_contract);
    fetchAccount();
  };

  // Fetch all campaigns
  const fetchCampaigns = async (_contract: ethers.Contract) => {
    try {
      console.log("Fetching campaigns from contract...");
      const allCampaigns = await _contract.getAllCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns from contract:", error);
    } finally {
      setLoading(false);
      setIsContractReady(true);
    }
  };

  // Fetch the user's account
  const fetchAccount = async () => {
    if (!window.ethereum) {
      console.error("Ethereum object not found.");
      return;
    }
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    }
  };

  // Request MetaMask to connect the wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("Ethereum object not found.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      InitContract();  // Reinitialize the contract after connecting the wallet
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Function to create a new campaign
  const createCampaign = async (
    name: string,
    description: string,
    goal: string
  ) => {
    if (!contract || !signer || !isContractReady) {
      console.error("Contract not ready or signer is not available.");
      return;
    }

    try {
      const tx = await contract.createCampaign(
        name,
        description,
        ethers.parseUnits(goal, 18)
      );
      await tx.wait();
      console.log("Campaign created successfully");
      fetchCampaigns(contract); // Refresh the campaign list
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  // Function to fund a campaign
  const fundCampaign = async (campaignId: number, amount: string) => {
    if (!contract || !signer || !isContractReady) {
      console.error("Contract not ready or signer is not available.");
      return;
    }

    try {
      const tx = await contract.fundCampaign(campaignId, {
        value: ethers.parseUnits(amount, 18),
      });
      await tx.wait();
      console.log("Campaign funded successfully");
      fetchCampaigns(contract); // Refresh the campaign list
    } catch (error) {
      console.error("Error funding campaign:", error);
    }
  };

  // Function to withdraw funds from a campaign
  const withdrawFunds = async (id: number) => {
    if (!contract || !signer || !isContractReady) {
      console.error("Contract not ready or signer is not available.");
      return;
    }

    try {
      const tx = await contract.withdrawFunds(id);
      await tx.wait();
      console.log("Funds withdrawn successfully");
      fetchCampaigns(contract); // Refresh the campaign list
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  // Get a single campaign by id
  const getCampaign = async (id: number) => {
    if (!contract || !isContractReady) {
      console.error("Contract not ready.");
      return;
    }

    try {
      const campaign = await contract.getCampaign(id);
      console.log("Fetched campaign:", campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };

  // Monitor account change in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        // Handle network change (e.g., refresh the page or reinitialize contract)
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    InitContract();
  }, []); // Run once on mount

  return (
    <ContractContext.Provider
      value={{
        contract,
        createCampaign,
        fundCampaign,
        getAllCampaigns: () => fetchCampaigns(contract!),
        getCampaign,
        withdrawFunds,
        campaigns,
        loading,
        isContractReady,
        account,
        connectWallet, 
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

const useContractContext = (): ContractContextInterface => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContractContext must be used within a ContractProvider");
  }
  return context;
};

export { ContractProvider, useContractContext };
