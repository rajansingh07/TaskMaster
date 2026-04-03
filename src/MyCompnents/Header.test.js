import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

describe('Header Component', () => {
  test('renders the TaskMaster brand name', () => {
    renderHeader();
    expect(screen.getByText(/taskmaster/i)).toBeInTheDocument();
  });

  test('renders the Home navigation link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  test('renders the Add Task navigation link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /add task/i })).toBeInTheDocument();
  });

  test('renders the About navigation link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  test('Home link points to the root path', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
  });

  test('Add Task link points to /add-todo', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /add task/i })).toHaveAttribute('href', '/add-todo');
  });

  test('About link points to /about', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute('href', '/about');
  });
});
