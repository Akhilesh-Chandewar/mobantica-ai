import fs from 'fs';
import path from 'path';
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const prompt = body.messages;

        if (!prompt || prompt.length === 0) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const apiKey = process.env.HUGGINGFACE_API_KEY;
        const model = "facebook/musicgen-small"; 
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs: prompt, duration: 30 },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                responseType: 'arraybuffer'
            }
        );

        if (!response.data) {
            return new NextResponse("No audio data returned", { status: 500 });
        }

        // Create a directory for audio files if it doesn't exist
        const audioDir = path.join(process.cwd(), 'public', 'audio');
        fs.mkdirSync(audioDir, { recursive: true });

        // Save audio data to a file with .mp3 extension
        const audioFilePath = path.join(audioDir, `${userId}-${Date.now()}.mp3`);
        fs.writeFileSync(audioFilePath, response.data, 'binary');

        // Return the path to the audio file
        return new NextResponse(JSON.stringify({ audioUrl: `/audio/${path.basename(audioFilePath)}` }), {
            status: 200,
            headers: {
                "Content-Type": 'application/json',
            },
        });
    } catch (error: any) {
        console.error("[MUSIC_GENERATION_ERROR]", error);
        const message = error.response?.data?.error || "Internal server error";
        return new NextResponse(message, { status: 500 });
    }
}
