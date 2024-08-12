import { SignIn } from "@clerk/nextjs";
import { Container, Box, Typography, Paper } from "@mui/material";

export default function Page() {
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ textAlign: 'center', mt: 3 }}>
          <SignIn />
        </Box>
      </Paper>
    </Container>
  );
}
