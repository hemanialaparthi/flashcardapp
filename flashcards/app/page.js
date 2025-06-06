import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Paper, Stack } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 4,
            backgroundColor: '#f5f5f5',
            marginBottom: 4,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Transform Your Texts into Flashcards
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Study smarter by generating flashcards from any text with our easy-to-use tool.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <SignedOut>
              <Button variant="contained" color="primary" size="large" component={Link} href="/sign-up">
                Sign Up
              </Button>
              <Button variant="outlined" color="primary" size="large" component={Link} href="/sign-in">
                Log In
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="contained" color="primary" size="large" component={Link} href="/generate">
                Generate Flashcards
              </Button>
              <Button variant="outlined" color="primary" size="large" component={Link} href="/flashcards">
                My Flashcards
              </Button>
            </SignedIn>
            <Button variant="text" color="primary" size="large" component={Link} href="/pricing">
              View Pricing
            </Button>
          </Stack>
        </Box>

        {/* features section */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Automatic Flashcard Creation
                </Typography>
                <Typography>
                  Paste your text, and our tool automatically generates flashcards using advanced AI.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Customizable Layouts
                </Typography>
                <Typography>
                  Tailor flashcards to fit your learning style with various layouts and card designs.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Save and Share
                </Typography>
                <Typography>
                  Save your flashcards and share them with friends or classmates for collaborative learning.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
