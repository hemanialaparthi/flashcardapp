'use client'
import { useUser } from "@clerk/nextjs"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return <></>
}