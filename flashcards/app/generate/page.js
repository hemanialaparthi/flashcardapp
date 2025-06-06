'use client'
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, TextField, Box, Button, 
         CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Snackbar } from "@mui/material";
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
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    const handleSubmit = async () => {
        if (!user) {
            setSnackbar({ 
                open: true, 
                message: 'You must be signed in to generate flashcards', 
                severity: 'error' 
            });
            return;
        }
        
        if (!text.trim()) {
            setSnackbar({ 
                open: true, 
                message: 'Please enter text to generate flashcards', 
                severity: 'error' 
            });
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Generated flashcards:", data);
            setFlashcards(data);
            
            setSnackbar({ 
                open: true, 
                message: 'Flashcards generated successfully!', 
                severity: 'success' 
            });
        } catch (err) {
            console.error("Error generating flashcards:", err);
            setError("Failed to generate flashcards. Please try again later.");
            
            setSnackbar({ 
                open: true, 
                message: 'Failed to generate flashcards. Please try again.', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = (index) => {
        setFlipped((prev) => ({
            ...prev,
            [index]: !prev[index], // Toggle flip state for the clicked flashcard
        }));
    };

    const saveFlashcards = async () => {
        if (!name.trim()) {
            setSnackbar({ 
                open: true, 
                message: 'Please enter a collection name', 
                severity: 'warning' 
            });
            return;
        }
        
        console.log("Starting to save flashcards:", { name, flashcards, userId: user?.id });
        
        try {
            setLoading(true);
            const batch = writeBatch(db);
            const docRef = doc(collection(db, 'users'), user.id);
            
            console.log("Getting document:", docRef.path);
            const docSnap = await getDoc(docRef);
            
            console.log("Document exists:", docSnap.exists(), "Data:", docSnap.data());

            if (docSnap.exists()) {
                // Check if a flashcard collection with the same name exists
                if (docSnap.data().flashcards && docSnap.data().flashcards.find((f) => f.name === name)) {
                    setSnackbar({ 
                        open: true, 
                        message: 'A collection with this name already exists', 
                        severity: 'error' 
                    });
                    setLoading(false);
                    return;
                }
                
                const collections = docSnap.data().flashcards || [];
                collections.push({ name, flashcards });
                
                console.log("Updating document with collections:", collections);
                batch.set(docRef, { flashcards: collections });

                // Add each flashcard to a subcollection with a batch
                flashcards.forEach((flashcard, index) => {
                    const flashcardRef = doc(collection(doc(collection(db, 'users'), user.id), name), `card-${index}`);
                    console.log("Adding flashcard to:", flashcardRef.path);
                    batch.set(flashcardRef, flashcard);
                });

                console.log("Committing batch...");
                await batch.commit();
                console.log("Batch committed successfully");
                
                setSnackbar({ 
                    open: true, 
                    message: 'Flashcards saved successfully!', 
                    severity: 'success' 
                });
                
                router.push('/flashcards');
            } else {
                console.log("Document doesn't exist, creating new document");
                batch.set(docRef, { flashcards: [{ name, flashcards }] });

                flashcards.forEach((flashcard, index) => {
                    const flashcardRef = doc(collection(doc(collection(db, 'users'), user.id), name), `card-${index}`);
                    console.log("Adding flashcard to:", flashcardRef.path);
                    batch.set(flashcardRef, flashcard);
                });

                console.log("Committing batch...");
                await batch.commit();
                console.log("Batch committed successfully");
                
                setSnackbar({ 
                    open: true, 
                    message: 'Flashcards saved successfully!', 
                    severity: 'success' 
                });
                
                router.push('/flashcards');
            }
        } catch (err) {
            console.error("Error saving flashcards:", err);
            setSnackbar({ 
                open: true, 
                message: 'Failed to save flashcards. Please try again: ' + err.message, 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    if (!isLoaded) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isLoaded && !isSignedIn) {
        router.push('/sign-in');
        return null;
    }

    return (
        <>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Generate Flashcards
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                    )}
                    
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text to generate flashcards"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={6}
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
                                Flashcards Preview (Click to flip)
                            </Typography>
                            <Grid container spacing={2}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card 
                                            onClick={() => handleFlip(index)} 
                                            sx={{ 
                                                cursor: 'pointer',
                                                height: '150px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CardActionArea sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="body1" component="div" align="center">
                                                        {flipped[index] ? flashcard.back : flashcard.front}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                                        {flipped[index] ? "Back (click to flip)" : "Front (click to flip)"}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                            <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
                                Save Flashcards
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
                                <Button 
                                    onClick={saveFlashcards} 
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Save'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={() => setSnackbar({...snackbar, open: false})}
                >
                    <Alert 
                        onClose={() => setSnackbar({...snackbar, open: false})} 
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}
