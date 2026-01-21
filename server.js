
import express from 'express';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'dist')));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Marta-Intelligence',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
