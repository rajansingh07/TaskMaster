import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About Component', () => {
  test('renders the About TaskMaster heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /about taskmaster/i })).toBeInTheDocument();
  });

  test('displays the version number', () => {
    render(<About />);
    expect(screen.getByText(/version/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.0\.0/)).toBeInTheDocument();
  });

  test('lists core task management features', () => {
    render(<About />);
    expect(screen.getByText(/add, edit, and delete tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/mark tasks as completed or pending/i)).toBeInTheDocument();
    expect(screen.getByText(/search tasks quickly/i)).toBeInTheDocument();
    expect(screen.getByText(/filter tasks by status/i)).toBeInTheDocument();
  });

  test('lists key technical features', () => {
    render(<About />);
    expect(screen.getByText(/localstorage persistence/i)).toBeInTheDocument();
    expect(screen.getByText(/priority badges/i)).toBeInTheDocument();
    expect(screen.getByText(/responsive design/i)).toBeInTheDocument();
  });
});
