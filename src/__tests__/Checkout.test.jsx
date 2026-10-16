import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../components/Checkout';
import { useCartContext } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

jest.mock('../context/CartContext', () => ({ useCartContext: jest.fn() }));
jest.mock('../context/OrderContext', () => ({ useOrders: jest.fn() }));
const item = { id: 1, name: 'Smart Watch', price: 100, quantity: 2, image: '' };

function setup() {
  const values = { cart: [item], subtotal: 200, discount: 0, delivery: 50, total: 250, clearCart: jest.fn() };
  const placeOrder = jest.fn();
  useCartContext.mockReturnValue(values);
  useOrders.mockReturnValue({ placeOrder });
  render(<MemoryRouter><Checkout /></MemoryRouter>);
  return { values, placeOrder };
}

test('shows checkout total', () => {
  setup();
  expect(screen.getByText(/Final amount: ₹250/i)).toBeInTheDocument();
});

test('validates required checkout information', async () => {
  const user = userEvent.setup();
  const { placeOrder } = setup();
  await user.click(screen.getByRole('button', { name: /place order/i }));
  expect(placeOrder).not.toHaveBeenCalled();
});

test('places an order and clears cart with valid information', async () => {
  const user = userEvent.setup();
  const { values, placeOrder } = setup();
  await user.type(screen.getByLabelText(/full name/i), 'Nivisha');
  await user.type(screen.getByLabelText(/address/i), 'Coimbatore');
  await user.type(screen.getByLabelText(/phone number/i), '9876543210');
  await user.click(screen.getByRole('button', { name: /place order/i }));
  expect(placeOrder).toHaveBeenCalledWith(expect.objectContaining({ total: 250, customer: expect.objectContaining({ name: 'Nivisha', phone: '9876543210' }) }));
  expect(values.clearCart).toHaveBeenCalled();
});
