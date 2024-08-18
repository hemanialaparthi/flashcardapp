'use client'
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, TextField, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import { collection, getDoc, setDoc, doc, writeBatch } from "firebase/firestore";
import db from "@/firebase";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [flipped, setFlipped] = useState({});
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

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
            [index]: !prev[index], // Toggle flip state for the clicked flashcard
        }));
    };

    const saveFlashcards = async () => {
        if (!name.trim()) return;

        const batch = writeBatch(db);
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Check if a flashcard collection with the same name exists
            if (docSnap.data().flashcards && docSnap.data().flashcards.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists');
            } else {
                const collections = docSnap.data().flashcards || [];
                collections.push({ name, flashcards });
                batch.set(docRef, { flashcards: collections });

                // Add each flashcard to a subcollection with a batch
                flashcards.forEach((flashcard) => {
                    const flashcardRef = doc(collection(doc(collection(db, 'users'), user.id), name));
                    batch.set(flashcardRef, flashcard);
                });

                await batch.commit();
                router.push('/flashcards');
            }
        } else {
            batch.set(docRef, { flashcards: [{ name, flashcards }] });

            flashcards.forEach((flashcard) => {
                const flashcardRef = doc(collection(doc(collection(db, 'users'), user.id), name));
                batch.set(flashcardRef, flashcard);
            });

            await batch.commit();
            router.push('/flashcards');
        }
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
                <>
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

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
                            Add to Firebase
                        </Button>
                    </Box>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Save Flashcards</DialogTitle>
                        <DialogContent>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label="Collection Name"
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={saveFlashcards} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
}
