"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/lib/constants";

// Type Definitions
interface Transaction {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  amount: number;
}

interface FormData {
  addressTo: string;
  amount: string;
  message: string;
}

interface TransactionContextType {
  transactionCount: number;
  transactions: Transaction[];
  currentAccount: string;
  isLoading: boolean;
  formData: FormData;
  ethBalance: string;
  connectWallet: () => Promise<void>;
  disConnectWallet: () => Promise<void>;
  sendTransaction: () => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Create Context
const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const getEthereum = (): typeof window.ethereum | null => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return null;
};

// Create Ethereum Contract Instance
const createEthereumContract = async () => {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error("Ethereum object not found");

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Context Provider
export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>({
    addressTo: "",
    amount: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ethBalance, setEthBalance] = useState<string>("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const getAllTransactions = useCallback(async () => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) throw new Error("Ethereum wallet is not connected");

      const transactionsContract = await createEthereumContract();
      const availableTransactions =
        await transactionsContract.getAllTransactions();

      const structuredTransactions: Transaction[] = availableTransactions.map(
        (tx: any) => ({
          addressTo: tx.receiver,
          addressFrom: tx.sender,
          timestamp: new Date(tx.timestamp.toNumber() * 1000).toLocaleString(),
          message: tx.message,
          amount: parseFloat(ethers.formatEther(tx.amount)),
        })
      );

      setTransactions(structuredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return alert("Please install MetaMask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts, "accounts");

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }, [getAllTransactions]);

  const checkIfTransactionsExist = useCallback(async () => {
    try {
      const transactionsContract = await createEthereumContract();
      const currentTransactionCount =
        await transactionsContract.getTransactionCount();
      setTransactionCount(currentTransactionCount.toNumber());
    } catch (error) {
      console.error("Error checking transactions:", error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    console.log("this is working");
    try {
      const ethereum = getEthereum();
      if (!ethereum)
        throw new Error("MetaMask is required to connect your wallet");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts, "accounts");

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // Fetch ETH balance
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const formattedBalance = ethers.formatEther(balance);
        setEthBalance(formattedBalance);
        getAllTransactions();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }, []);

  const disConnectWallet = useCallback(async () => {
    setCurrentAccount("");
    return Promise.resolve();
  }, []);

  const sendTransaction = useCallback(async () => {
    try {
      if (!currentAccount)
        throw new Error("No account connected. Please connect your wallet.");

      const { addressTo, amount, message } = formData;
      const ethereum = getEthereum();
      if (!ethereum) throw new Error("Ethereum object is not available");
      setIsLoading(true);
      const transactionsContract = await createEthereumContract();
      const parsedAmount = ethers.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount.toString(),
          },
        ],
      });

      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message
      );
      console.log(`Transaction Pending: ${transactionHash.hash}`);

      await transactionHash.wait();
      console.log(`Transaction Confirmed: ${transactionHash.hash}`);

      setIsLoading(false);
      setFormData({ addressTo: "", amount: "", message: "" });
      await checkIfTransactionsExist();
    } catch (error) {
      console.error("Error sending transaction:", error);
      setIsLoading(false);
      setFormData({ addressTo: "", amount: "", message: "" });
    }
  }, [currentAccount, formData, checkIfTransactionsExist]);

  useEffect(() => {
    // checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [checkIfTransactionsExist]);

  const contextValue = useMemo(
    () => ({
      transactionCount,
      transactions,
      currentAccount,
      isLoading,
      formData,
      connectWallet,
      disConnectWallet,
      sendTransaction,
      handleChange,
      ethBalance,
    }),
    [
      transactionCount,
      ethBalance,
      transactions,
      currentAccount,
      isLoading,
      formData,
      connectWallet,
      sendTransaction,
      handleChange,
      disConnectWallet,
    ]
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom Hook to use the Transaction Context
export const useTransactionContext = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context)
    throw new Error(
      "useTransactionContext must be used within a TransactionsProvider"
    );
  return context;
};
