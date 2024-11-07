import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        console.log(`Generating image with prompt: ${prompt}`);

        const response = await hf.textToImage({
            model: "stabilityai/stable-diffusion-2",
            inputs: prompt,
            parameters: {
                negative_prompt: "blurry",
            },
        });

        if (response instanceof Blob) {
            return new NextResponse(response, {
                headers: {
                    "Content-Type": "image/jpeg",
                },
            });
        }

        return new NextResponse("No image generated", { status: 500 });
    } catch (error) {
        console.error("[IMAGE_GENERATION_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
