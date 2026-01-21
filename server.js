
const express = require('express');
const app = express();
// Initialize stripe with a key from environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Use express.static to serve the React app from the 'dist' directory
app.use(express.static('dist'));

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  // Dynamically determine the base URL for success and cancel URLs
  const baseUrl = req.protocol + '://' + req.get('host');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Marta PRO',
            },
            unit_amount: 9900, // R$99,00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fallback for client-side routing: serve index.html for any unknown paths
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
});

// Use the port from environment variables or default to 4242
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
