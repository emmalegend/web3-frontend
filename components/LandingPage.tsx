"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import EthCard from "./EthCard";
import ExchangeForm from "./ExchangeForm";
import TransactionsTable from "./TransactionsTable";
import { useTransactionContext } from "@/context/TransactIonContext";

export default function CryptoExchange() {
  const { currentAccount, connectWallet, disConnectWallet, ethBalance } =
    useTransactionContext();

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 text-white'>
      {/* Navbar */}
      <nav className='flex justify-between items-center px-6 py-4 bg-black/20 backdrop-blur-sm shadow-lg'>
        <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
          CryptoExchange
        </h1>

        <Button
          onClick={currentAccount ? disConnectWallet : connectWallet}
          className='bg-purple-600 hover:bg-purple-700 text-white'
        >
          <Wallet size={18} className='mr-2' />
          {currentAccount ? "Disconnect" : "Connect"} Wallet
        </Button>
      </nav>

      {/* Content */}
      <div className='flex-1 px-6 py-8 overflow-auto'>
        <div className='max-w-7xl mx-auto space-y-8'>
          {currentAccount && (
            <EthCard balance={ethBalance} address={currentAccount} />
          )}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ExchangeForm />
            <TransactionsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
