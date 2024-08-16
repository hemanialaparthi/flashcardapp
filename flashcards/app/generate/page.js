'use client';
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, TextField, Box, Button, CircularProgress } from "@mui/material";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [flipped, setFlipped] = useState({});

    const handleSubmit = async () => {
        if (!user || !text.trim()) return;
        setLoading(true);

        const flashcards = await fetch('api/generate', {
            method: 'POST',
            body: text
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
            .finally(() => setLoading(false));
    };

    const handleFlip = (index) => {
        setFlipped((prev) => ({
            ...prev,
            [index]: !prev[index], // toggle flip state for the clicked flashcard
        }));
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : 'Generate Flashcards'}
                </Button>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card onClick={() => handleFlip(index)} sx={{ cursor: 'pointer' }}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {flipped[index] ? flashcard.back : flashcard.front}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {flipped[index] ? "Back of the card" : "Front of the card"}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}
