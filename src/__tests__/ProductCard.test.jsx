import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';

jest.mock('../context/CartContext', () => ({ useCartContext: jest.fn() }));

const product = { id: 1, name: 'Smart Watch', category: 'Electronics', price: 1500, rating: 4.5, count: 20, image: '/watch.png' };

describe('ProductCard', () => {
  test('renders product details', () => {
    useCartContext.mockReturnValue({ addToCart: jest.fn() });
    render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Smart Watch' })).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  test('calls add-to-cart when clicked', async () => {
    const user = userEvent.setup();
    const addToCart = jest.fn();
    useCartContext.mockReturnValue({ addToCart });
    render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
