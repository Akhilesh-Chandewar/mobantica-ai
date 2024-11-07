'use client'

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

function LandingNavbar() {
    const { isSignedIn } = useAuth();

    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative w-32 h-12 mr-4">
                    <Image 
                        fill 
                        alt="logo" 
                        src="https://mobantica.com/wp-content/uploads/2023/03/logo_mobantica.png" 
                        style={{ objectFit: 'contain' }} 
                    />
                </div>
            </Link>
            <div>
                {isSignedIn ? (
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild className="ml-4">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}

function LandingPage() {
    return (
        <div className={`${font.className} flex flex-col items-center justify-center h-screen`}>
            <LandingNavbar />
            <main className="flex flex-col items-center text-center mt-16">
                <h1 className="text-4xl font-bold mb-4">Welcome to Mobantica AI</h1>
                <p className="text-lg mb-8">Empowering your business with advanced AI solutions.</p>
                <Button asChild>
                    <Link href="/learn-more">Learn More</Link>
                </Button>
            </main>
        </div>
    );
}

export default LandingPage;
