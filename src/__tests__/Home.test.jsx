import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../components/Home';
import { useCartContext } from '../context/CartContext';

jest.mock('../context/CartContext', () => ({ useCartContext: jest.fn() }));

const products = [
  { id: 1, name: 'Smart Watch', category: 'Electronics', price: 1500, rating: 4.5, count: 10, image: '' },
  { id: 2, name: 'Running Shoes', category: 'Footwear', price: 900, rating: 4.2, count: 5, image: '' }
];

function renderHome(overrides = {}) {
  useCartContext.mockReturnValue({ addToCart: jest.fn() });
  const props = {
    search: '', setSearch: jest.fn(), category: 'All', setCategory: jest.fn(),
    categories: ['All', 'Electronics', 'Footwear'], filteredProducts: products,
    visibleProducts: products, loading: false, error: '', page: 1, setPage: jest.fn(),
    totalPages: 1, retry: jest.fn(), ...overrides
  };
  return { ...render(<MemoryRouter><Home {...props} /></MemoryRouter>), props };
}

test('renders product list', () => {
  renderHome();
  expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Smart Watch' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Running Shoes' })).toBeInTheDocument();
});

test('sends search and category changes to filtering state handlers', () => {
  const { props } = renderHome();
  fireEvent.change(screen.getByRole('textbox', { name: /search products/i }), { target: { value: 'watch' } });
  fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'Electronics' } });
  expect(props.setSearch).toHaveBeenCalledWith('watch');
  expect(props.setCategory).toHaveBeenCalledWith('Electronics');
});

test('shows empty state when no products match', () => {
  renderHome({ filteredProducts: [], visibleProducts: [] });
  expect(screen.getByText('No products found')).toBeInTheDocument();
});
