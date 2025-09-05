import Link from "next/link";
import QualitiesCard from "./cards/QualitiesCard";

export default function WhyDifferentSection() {
    return (
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto ">
                <h2 className="text-5xl text-center mb-6 text-[var(--coffee-brown)] font-extrabold" style={{fontFamily: 'cursive'}}>Why are we different?</h2>
                <p className="text-lg text-center mb-4">At Café Shop, we take pride in offering the finest coffee experience.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <QualitiesCard
                        icon="/cards/coffee-beans.png"
                        title="Supreme Beans"
                        description="We source the finest coffee beans from around the world."
                    />
                    <QualitiesCard
                        icon="/cards/coffee-cup.png"
                        title="Extraordinary"
                        description="Coffee like you've never tasted."
                    />
                    <QualitiesCard
                        icon="/cards/badge.png"
                        title="High Quality"
                        description="Enjoy your coffee in a warm and inviting space."
                    />
                    <QualitiesCard
                        icon="/cards/best-price.png"
                        title="Affordable Prices"
                        description="We offer competitive pricing without compromising on quality."
                    />
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <p className="text-center text-lg text-[var(--coffee-brown)] font-extrabold mt-6 mb-5" >Experience the difference with every sip.</p>
                    <Link href="/products" className="px-4 py-2 bg-[var(--coffee-brown)] text-white rounded-full hover:scale-105 transition-transform">
                        Check it for yourself
                    </Link>
                </div>
            </div>
        </section>
    );
}
