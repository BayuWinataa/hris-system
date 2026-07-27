"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { updateProfileImage } from "@/app/actions/settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ProfileImageUploadProps {
    currentImage?: string | null;
    userName: string;
}

export function ProfileImageUpload({ currentImage, userName }: ProfileImageUploadProps) {
    const [image, setImage] = useState(currentImage);
    const [error, setError] = useState("");
    const router = useRouter();

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <Avatar className="h-24 w-24 border shadow-sm">
                <AvatarImage src={image || ""} alt={userName} className="object-cover" />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {initials}
                </AvatarFallback>
            </Avatar>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <div className="w-full max-w-xs ut-button:bg-primary ut-button:ut-readying:bg-primary/50">
                <UploadButton
                    endpoint="profileImage"
                    onClientUploadComplete={async (res) => {
                        // res is an array of objects representing the uploaded files
                        if (res && res.length > 0) {
                            const url = res[0].url;
                            setImage(url);
                            await updateProfileImage(url);
                            router.refresh();
                        }
                    }}
                    onUploadError={(error: Error) => {
                        setError(`ERROR! ${error.message}`);
                    }}
                />
            </div>
        </div>
    );
}
