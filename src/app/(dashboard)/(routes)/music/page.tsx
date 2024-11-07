'use client';

import * as z from "zod";
import Heading from "@/components/Heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formScheme } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";

function MusicPage() {
    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formScheme>) => {
        try {
            setError(null);
        
            const response = await fetch("/api/music", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    messages: values.prompt,
                }),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch response from the server.");
            }
    
            const { audioUrl } = await response.json();
            setMusic(audioUrl); 
            form.reset();
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Something went wrong.");
        } finally {
            router.refresh();
        }
    };
    

    return (
        <div>
            <Heading
                title="Music Generation"
                description="Turn your prompt into music"
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <div className="px-4 lg:px-8">
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
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {!isLoading && error && (
                        <div className="text-red-500">{error}</div>
                    )}
                    {!isLoading && music === undefined && !error && (
                        <Empty label="No music generated yet." />
                    )}
                    {!isLoading && music && (
                        <div>
                            <audio controls className="w-full mt-8">
                                <source src={music} />
                            </audio>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MusicPage;
