import Image from "next/image";

function Loader() {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 flex items-center justify-center animate-spin">
                    <div className="border-4 border-t-4 border-gray-300 rounded-full w-full h-full opacity-50"></div> 
                </div>
                <Image
                    alt="Loading"
                    fill
                    src="https://media.licdn.com/dms/image/v2/C5103AQHWWn1uz5cCKA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1554289165544?e=2147483647&v=beta&t=XxtHKszNhDxYBv-IKzN1-IZb0bx61ftSPPYiqeFsg2E"
                    className="object-cover rounded-full opacity-70" 
                />
            </div>
            <p className="text-muted-foreground text-sm text-center">
                Mobantica Generating Response...
            </p>
        </div>
    );
}

export default Loader;
