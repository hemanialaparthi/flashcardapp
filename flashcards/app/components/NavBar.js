'use client';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, useScrollTrigger, Slide } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <HideOnScroll>
      <AppBar position="sticky" color="default" elevation={0} sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Typography variant="h6" component={Link} href="/" sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>F</Avatar>
              FlashMaster
            </Typography>
            
            <SignedIn>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href="/generate"
                  variant={pathname === '/generate' ? 'contained' : 'text'}
                  sx={{ 
                    color: pathname === '/generate' ? 'white' : 'text.primary',
                    borderRadius: '20px',
                    px: 2
                  }}
                >
                  Generate
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href="/flashcards"
                  variant={pathname === '/flashcards' ? 'contained' : 'text'}
                  sx={{ 
                    color: pathname === '/flashcards' ? 'white' : 'text.primary',
                    borderRadius: '20px',
                    px: 2
                  }}
                >
                  My Flashcards
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href="/pricing"
                  variant={pathname === '/pricing' ? 'contained' : 'text'}
                  sx={{ 
                    color: pathname === '/pricing' ? 'white' : 'text.primary',
                    borderRadius: '20px',
                    px: 2
                  }}
                >
                  Pricing
                </Button>
                <Box sx={{ ml: 1 }}>
                  <UserButton afterSignOutUrl="/" />
                </Box>
              </Box>
            </SignedIn>
            
            <SignedOut>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href='/pricing'
                  sx={{ borderRadius: '20px' }}
                >
                  Pricing
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href='/sign-in'
                  sx={{ borderRadius: '20px' }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  href='/sign-up'
                  sx={{ borderRadius: '20px' }}
                >
                  Sign Up
                </Button>
              </Box>
            </SignedOut>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}