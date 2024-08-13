'use client';
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    // Get query parameter
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push(doc.data());
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    const handleCardClick = (index) => {
        setFlipped((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {flipped[index] ? flashcard.back : flashcard.front}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
