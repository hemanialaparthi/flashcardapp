'use client';
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc, deleteField, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Grid, Card, CardActionArea, CardContent, CardActions, Typography, Button, Box, Alert, CircularProgress } from "@mui/material";
import DeleteFlashcardDialog from "../components/DeleteFlashcardDialog";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user || !user.id) {
                return;  // exit if user is not loaded or doesn't have an ID
            }

            try {
                setLoading(true);
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // assuming 'flashcards' is an array of objects with a 'name' property
                    const collections = docSnap.data().flashcards;
                    setFlashcards(collections || []);
                } else {
                    await setDoc(docRef, {});
                }
            } catch (err) {
                console.error("Error fetching flashcards:", err);
                setError("Failed to load your flashcards. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            getFlashcards();
        } else if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        }
    }, [user, isLoaded, isSignedIn, router]);

    const handleCardClick = (flashcardName) => {
        router.push(`/flashcard?id=${flashcardName}`);
    };

    const handleDeleteClick = (event, flashcardName) => {
        event.stopPropagation();
        setSelectedCollection(flashcardName);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCollection || !user) return;

        try {
            const userDocRef = doc(collection(db, 'users'), user.id);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userFlashcards = userDoc.data().flashcards || [];
                const updatedFlashcards = userFlashcards.filter(
                    (flashcard) => flashcard.name !== selectedCollection
                );
                
                await updateDoc(userDocRef, {
                    flashcards: updatedFlashcards
                });
                
                setFlashcards(updatedFlashcards);
            }
        } catch (err) {
            console.error("Error deleting collection:", err);
            setError("Failed to delete collection. Please try again.");
        }
        
        setDeleteDialogOpen(false);
        setSelectedCollection(null);
    };

    if (!isLoaded) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">My Flashcards</Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => router.push('/generate')}
                    >
                        Create New Flashcards
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {flashcards.length > 0 ? (
                            <Grid container spacing={4}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardActionArea 
                                                onClick={() => handleCardClick(flashcard.name)}
                                                sx={{ flexGrow: 1 }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {flashcard.flashcards?.length || 0} cards
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions>
                                                <Button 
                                                    size="small"
                                                    onClick={() => handleCardClick(flashcard.name)}
                                                >
                                                    View
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    color="error"
                                                    onClick={(e) => handleDeleteClick(e, flashcard.name)}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" sx={{ mb: 3 }}>
                                    No flashcards found.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => router.push('/generate')}
                                >
                                    Create Your First Flashcards
                                </Button>
                            </Box>
                        )}
                    </>
                )}

                <DeleteFlashcardDialog 
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    collectionName={selectedCollection}
                />
            </Container>
        </>
    );
}
