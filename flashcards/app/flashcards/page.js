'use client';
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user || !user.id) {
                return;  // Exit if user is not loaded or doesn't have an ID
            }

            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards;
                console.log("Flashcards data:", collections);
                setFlashcards(collections || []);
            } else {
                await setDoc(docRef, {});
            }
        }

        if (user) {
            getFlashcards();
        }
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    const handleCardClick = (flashcardName) => {
        router.push(`/flashcard?id=${flashcardName}`);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard)}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {flashcard}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ width: '100%' }}>
                        No flashcards found.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}
