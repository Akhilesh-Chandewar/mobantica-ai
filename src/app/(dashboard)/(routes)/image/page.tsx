'use client';

import * as z from "zod";
import Heading from "@/components/Heading";
import { ImageIcon } from "lucide-react";
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

function ConversationPage() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            prompt: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formScheme>) => {
        try {
            setImage(null);
            const response = await fetch("/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: values.prompt,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate image");
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
            form.reset();
        } catch (error) {
            console.error("[IMAGE_GENERATION_ERROR]", error);
            alert("An error occurred while generating the image.");
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Image Generation"
                description="Turn your text into an image"
                icon={ImageIcon}
                iconColor="text-pink-500"
                bgColor="bg-pink-500/10"
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
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {image === null && !isLoading && (
                        <Empty label="No image generated." />
                    )}
                    {image && (
                        <img src={image} alt="Generated Image" className="rounded-md shadow" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;
