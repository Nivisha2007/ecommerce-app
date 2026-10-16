import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCartContext } from '../context/CartContext';

jest.mock('../context/CartContext', () => ({ useCartContext: jest.fn() }));

const item = { id: 1, name: 'Smart Watch', price: 100, quantity: 2, image: '' };
function setup(overrides = {}) {
  const values = { cart: [item], removeFromCart: jest.fn(), updateQuantity: jest.fn(), subtotal: 200, discount: 0, delivery: 50, total: 250, ...overrides };
  useCartContext.mockReturnValue(values);
  render(<MemoryRouter><Cart /></MemoryRouter>);
  return values;
}

test('renders cart item and calculated total', () => {
  setup();
  expect(screen.getByRole('heading', { name: 'Smart Watch' })).toBeInTheDocument();
  expect(screen.getByText(/Final Amount: ₹250/)).toBeInTheDocument();
});

test('removes an item from cart', async () => {
  const user = userEvent.setup();
  const values = setup();
  await user.click(screen.getByRole('button', { name: /remove/i }));
  expect(values.removeFromCart).toHaveBeenCalledWith(1);
});

test('updates quantity with plus and minus buttons', async () => {
  const user = userEvent.setup();
  const values = setup();
  await user.click(screen.getByRole('button', { name: /increase quantity/i }));
  await user.click(screen.getByRole('button', { name: /decrease quantity/i }));
  expect(values.updateQuantity).toHaveBeenNthCalledWith(1, 1, 3);
  expect(values.updateQuantity).toHaveBeenNthCalledWith(2, 1, 1);
});

test('shows empty cart message', () => {
  setup({ cart: [] });
  expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
});
