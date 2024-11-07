'use client';

import * as z from "zod";
import Heading from "@/components/Heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formScheme } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

type ChatCompletionRequestMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

function CodePage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formScheme>) => {
        try {
            const userMessages: ChatCompletionRequestMessage = {
                role: "user",
                content: "You are a code generator. You must answer only in markdown code snippet. Use code comments for explanations." + values.prompt
            };
            setMessages((current) => [...current, userMessages]);

            const response = await fetch("/api/code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessages],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from the server.");
            }

            const assistantResponse: { message: string } = await response.json();
            const assistantMessage: ChatCompletionRequestMessage = {
                role: "assistant",
                content: assistantResponse.message,
            };

            setMessages((current) => [...current, assistantMessage]);
            form.reset();
        } catch (error: any) {
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate code with descriptive text"
                icon={Code}
                iconColor="text-green-500"
                bgColor="bg-green-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                placeholder="Type your prompt here..."
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="col-span-12 lg:col-span-2 w-full"
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started." />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                    components={{
                                        code({ node, className, children }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return match ? (
                                                <SyntaxHighlighter
                                                    style={solarizedlight} 
                                                    language={match[1]}
                                                    PreTag="div"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {message.content || ""}
                                </ReactMarkdown>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;
