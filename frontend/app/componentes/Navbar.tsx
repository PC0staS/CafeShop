'use client'
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ textcolor }: { textcolor?: string }) {
  return (
    <nav className={`flex flex-row justify-between items-center p-4 ${textcolor} px-6 bg-transparent backdrop-blur-md fixed w-full top-0 z-50`}>
      <div >
        <Link href="/" className="flex items-center">
            <Image src="/logo.webp" alt="Logo" width={60} height={60} className="rounded-full" />
            <span className="ml-2 text-2xl font"><strong>Café</strong>Shop</span>
        </Link>
      </div>
      <div>
        <p className="text-sm font-bold">Your one-stop shop for the best coffee.</p>
      </div>
      <div>
        <Link href="/about" className="text-xl font-semibold">About us</Link>
      </div>
    </nav>
  );
}
