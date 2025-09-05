import Link from "next/link";
import Image from "next/image";

export default function LandingSection() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen">
           
                <Image src="/coffee_image.png" alt="Coffee Shop" width={600} height={400} content="cover" className=" absolute -z-1 shadow-lg w-full h-full" />

            <div className="relative z-10 text-center p-6 bg-opacity-70  top-0 right-70 text-white text-2xl">
                <h1 className="text-6xl font-bold" style={{fontFamily: 'cursive'}}>Welcome to Café Shop</h1>
                <p className="mt-4 text-lg mb-5">Discover our range of premium coffee products.</p>
                <Link href="/products" className="px-4 py-2 bg-[var(--coffee-brown)] text-white rounded-full hover:scale-105 transition-transform">
                    Check out our products
                </Link>
            </div>
        </section>
    );
}
