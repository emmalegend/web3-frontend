"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, RefreshCcw } from "lucide-react";
import NextLink from "next/link";

const transactions = [
  { id: 1, from: "0x1234...5678", to: "0x8765...4321", amount: "0.1 ETH" },
  { id: 2, from: "0x2345...6789", to: "0x9876...5432", amount: "0.05 ETH" },
  { id: 3, from: "0x3456...7890", to: "0x0987...6543", amount: "0.2 ETH" },
  { id: 4, from: "0x1234...5678", to: "0x8765...4321", amount: "0.1 ETH" },
];

export default function TransactionsTable() {
  return (
    <Card className='bg-white/10 backdrop-blur-md shadow-xl border-t border-white/20 '>
      <CardHeader className='border-b border-white/10'>
        <CardTitle className='text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          <RefreshCcw size={24} className='text-purple-400' /> Recent
          Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='overflow-x-auto h-68 '>
          <table className='w-full text-sm '>
            <thead className='sticky top-0 '>
              <tr className='text-left border-b border-white/10 pb-20'>
                <th className='pb-2 font-semibold text-purple-300'>From</th>
                <th className='pb-2 font-semibold text-purple-300'>To</th>
                <th className='pb-2 font-semibold text-purple-300'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className='py-2'>{tx.from}</td>
                  <td className='py-2'>{tx.to}</td>
                  <td className='py-2 font-medium text-green-400'>
                    {tx.amount}
                  </td>
                  {/* <NextLink href='google.com'>
                    <Link height={20} width={20} />
                  </NextLink> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
