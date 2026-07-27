import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" // ganti dengan URL produksi saat deploy
});

export const { signIn, signUp, signOut, useSession } = authClient;
