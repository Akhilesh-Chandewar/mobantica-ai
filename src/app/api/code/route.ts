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
        const messages = body.messages;

        if (!messages || messages.length === 0) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const response = await hf.chatCompletion({
            model: "google/gemma-2-2b-it",
            messages: messages,
            max_tokens: 500,
        });

        const assistantMessage = response.choices[0]?.message?.content;
        if (!assistantMessage) {
            return new NextResponse("No response from model", { status: 500 });
        }
        console.log(assistantMessage)
        return NextResponse.json({ message: assistantMessage });
    } catch (error) {
        console.error("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
