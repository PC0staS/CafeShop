import Image from "next/image";

type QualitiesCardProps = {
    icon: string;
    title: string;
    description: string;
};

export default function QualitiesCard({ icon, title, description }: QualitiesCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-md items-center align-center text-center flex flex-col bg-amber-100 border-amber-300">
            <Image src={icon} alt={title} width={70} height={70} className="mb-4" />
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 text-lg">{description}</p>
        </div>
    );
}
