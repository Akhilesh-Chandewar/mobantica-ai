import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { Pinecone } from '@pinecone-database/pinecone';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});
const index = pineconeClient.index('medical-chat-bot');

export const getEmbeddings = async (text: string[]): Promise<number[]> => {
    try {
        const response = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text.join(' '),
        });
        // @ts-ignore
        return response.flat();
    } catch (error : any) {
        throw new Error('Failed to get embeddings: ' + error.message);
    }
};

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const messages = body.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const questionEmb = await getEmbeddings(messages);
        const queryRequest = {
            vector: questionEmb,
            topK: 5,
            includeValues: true,
            includeMetadata: true,
        };

        const result = await index.query(queryRequest);
        const context = result.matches.map(item => item.metadata?.text).filter(Boolean);
        console.log(context)
        const prompt = `
            Use the following pieces of information to answer the user's question.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.

            Context: ${context.join('\n')}
            Question: ${messages.join('\n')}

            Only return the helpful answer below and nothing else.
            Helpful answer:
        `;

        const response = await hf.chatCompletion({
            model: "google/gemma-2-2b-it",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });

        const assistantMessage = response.choices[0]?.message.content;
        if (!assistantMessage) {
            return new NextResponse("No response from model", { status: 500 });
        }

        return NextResponse.json({ message: assistantMessage });
    } catch (error) {
        console.error("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
