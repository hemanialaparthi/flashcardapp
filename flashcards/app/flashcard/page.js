'use client';
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button, CircularProgress, Paper } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'slideshow'

    // Get query parameter
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const router = useRouter();

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;

            try {
                setLoading(true);
                const colRef = collection(doc(collection(db, 'users'), user.id), search);
                const docs = await getDocs(colRef);
                const flashcards = [];
                docs.forEach((doc) => {
                    flashcards.push(doc.data());
                });
                setFlashcards(flashcards);
            } catch (err) {
                console.error("Error fetching flashcards:", err);
                setError("Failed to load flashcards. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        
        if (user) {
            getFlashcard();
        } else if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        }
    }, [search, user, isLoaded, isSignedIn, router]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped({});
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped({});
        }
    };

    const resetFlipped = () => {
        setFlipped({});
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
                    <Button onClick={() => router.push('/flashcards')}>
                        Back to Collections
                    </Button>
                    <Typography variant="h4">{search}</Typography>
                    <Box>
                        <Button 
                            variant={viewMode === 'grid' ? 'contained' : 'outlined'} 
                            onClick={() => setViewMode('grid')}
                            sx={{ mr: 1 }}
                        >
                            Grid
                        </Button>
                        <Button 
                            variant={viewMode === 'slideshow' ? 'contained' : 'outlined'} 
                            onClick={() => setViewMode('slideshow')}
                        >
                            Slideshow
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Box sx={{ color: 'error.main', mb: 3 }}>{error}</Box>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {flashcards.length > 0 ? (
                            viewMode === 'grid' ? (
                                <Grid container spacing={4}>
                                    {flashcards.map((flashcard, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card 
                                                onClick={() => handleCardClick(index)}
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    height: '200px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                                className={`card-flip ${flipped[index] ? 'flipped' : ''}`}
                                            >
                                                <Box className="card-front">
                                                    <Typography variant="h6" component="div" align="center">
                                                        {flashcard.front}
                                                    </Typography>
                                                </Box>
                                                <Box className="card-back">
                                                    <Typography variant="h6" component="div" align="center">
                                                        {flashcard.back}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Paper 
                                        elevation={3}
                                        onClick={() => handleCardClick('current')}
                                        sx={{ 
                                            width: '100%',
                                            height: '400px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            mb: 4,
                                            p: 4,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="h5">
                                            {flipped['current'] ? flashcards[currentIndex].back : flashcards[currentIndex].front}
                                        </Typography>
                                    </Paper>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                        <Button 
                                            variant="outlined"
                                            onClick={prevCard}
                                            disabled={currentIndex === 0}
                                        >
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outlined"
                                            onClick={resetFlipped}
                                        >
                                            Flip
                                        </Button>
                                        <Button 
                                            variant="contained"
                                            onClick={nextCard}
                                            disabled={currentIndex === flashcards.length - 1}
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                    
                                    <Typography sx={{ mt: 2 }}>
                                        Card {currentIndex + 1} of {flashcards.length}
                                    </Typography>
                                </Box>
                            )
                        ) : (
                            <Typography variant="h6" align="center" sx={{ width: '100%', mt: 4 }}>
                                No flashcards found in this collection.
                            </Typography>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}
