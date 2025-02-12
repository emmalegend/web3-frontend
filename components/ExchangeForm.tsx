"use client";

import { useState, useContext } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import { useTransactionContext } from "@/context/TransactIonContext";

export default function ExchangeForm() {
  const { handleChange, formData, sendTransaction, isLoading } =
    useTransactionContext();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };

  return (
    <Card className='bg-white/10 backdrop-blur-md shadow-xl border-t border-white/20'>
      <CardHeader className='border-b border-white/10'>
        <CardTitle className='text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          <Send size={24} className='text-purple-400' /> Send Crypto
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            placeholder='Address To'
            name='addressTo'
            type='text'
            value={formData?.addressTo}
            onChange={(e) => handleChange(e, "addressTo")}
            required
            className='bg-white/5 border-white/10 text-white placeholder-purple-500'
          />
          <Input
            placeholder='Amount (ETH)'
            name='amount'
            type='number'
            step='0.001'
            value={formData?.amount}
            onChange={(e) => handleChange(e, "amount")}
            required
            className='bg-white/5 border-white/10 text-white placeholder-purple-500'
          />
          <Input
            placeholder='Enter Message'
            name='message'
            type='text'
            value={formData?.message}
            onChange={(e) => handleChange(e, "message")}
            required
            className='bg-white/5 border-white/10 text-white placeholder-purple-500'
          />
          <Button
            type='submit'
            disabled={isLoading}
            className='mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold'
          >
            {isLoading ? <Loader /> : "Send Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
