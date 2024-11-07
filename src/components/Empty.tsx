import Image from "next/image";

interface EmptyProps {
    label: string;
}

function Empty({ label }: EmptyProps) {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
                <Image
                    alt="Empty"
                    fill
                    src="https://mobantica.com/wp-content/uploads/2023/03/logo_mobantica.png"
                    className="object-contain opacity-30" 
                />
            </div>
            <p className="text-muted-foreground text-sm text-center">{label}</p> 
        </div>
    );
}

export default Empty;
