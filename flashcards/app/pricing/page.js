import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

export default function Pricing() {
  const tiers = [
    {
      title: 'Free',
      price: '0',
      description: 'Basic features for students',
      features: [
        'Generate up to 5 flashcard sets per month',
        'Limited to 10 cards per set',
        'Basic text processing',
      ],
      buttonText: 'Sign up for free',
      buttonVariant: 'outlined',
      href: '/sign-up',
    },
    {
      title: 'Pro',
      subheader: 'Most popular',
      price: '9.99',
      description: 'Perfect for serious learners',
      features: [
        'Generate unlimited flashcard sets',
        'Up to 50 cards per set',
        'Advanced AI text processing',
        'Export to PDF and other formats',
        'Priority support',
      ],
      buttonText: 'Get started',
      buttonVariant: 'contained',
      href: '/sign-up',
    },
    {
      title: 'Enterprise',
      price: '29.99',
      description: 'For teams and educational institutions',
      features: [
        'Unlimited everything',
        'Team sharing capabilities',
        'Advanced analytics',
        'Custom AI models',
        'Dedicated support',
        'API access',
      ],
      buttonText: 'Contact us',
      buttonVariant: 'outlined',
      href: '/sign-up',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 8, pb: 6 }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Pricing
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Choose the plan that best fits your learning needs
        </Typography>
      </Box>
      
      <Grid container spacing={4} alignItems="flex-end" sx={{ mb: 8 }}>
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: tier.subheader ? '2px solid #3f51b5' : 'none',
              boxShadow: tier.subheader ? 3 : 1
            }}>
              {tier.subheader && (
                <Box sx={{ bgcolor: '#3f51b5', color: 'white', py: 1 }}>
                  <Typography variant="subtitle1" align="center">
                    {tier.subheader}
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography component="h2" variant="h4" color="text.primary" align="center">
                  {tier.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                  <Typography component="h2" variant="h3" color="text.primary">
                    ${tier.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /mo
                  </Typography>
                </Box>
                <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic' }}>
                  {tier.description}
                </Typography>
                <List>
                  {tier.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <Typography color="#3f51b5" sx={{ fontWeight: 'bold' }}>✓</Typography>
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button fullWidth variant={tier.buttonVariant} color="primary" href={tier.href}>
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}