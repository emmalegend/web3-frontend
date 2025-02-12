import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface EthCardProps {
  balance: string;
  address: string;
}

export default function EthCard({ balance, address }: EthCardProps) {
  return (
    <Card className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden shadow-xl'>
      <CardContent className='p-6 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>ETH Balance</h2>
          <p className='text-4xl font-extrabold'>{balance.slice(0, 6)} ETH</p>
          {address && (
            <p className='mt-2 text-sm opacity-75'>
              Address: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </div>
        <div className='relative w-24 h-24 animate-pulse'>
          <Image
            src='/ethereum-logo.svg'
            alt='Ethereum Logo'
            layout='fill'
            objectFit='contain'
          />
        </div>
      </CardContent>
    </Card>
  );
}
