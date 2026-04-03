import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from './AddTodo';

describe('AddTodo Component', () => {
  const mockAddTodo = jest.fn();

  beforeEach(() => {
    mockAddTodo.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test('renders the form with title, description and priority fields', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    expect(screen.getByPlaceholderText(/enter title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  test('priority select defaults to Low', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    expect(screen.getByRole('combobox')).toHaveValue('Low');
  });

  test('updates the title input value as the user types', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    const titleInput = screen.getByPlaceholderText(/enter title/i);
    fireEvent.change(titleInput, { target: { value: 'My New Task' } });
    expect(titleInput).toHaveValue('My New Task');
  });

  test('updates the description input value as the user types', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    const descInput = screen.getByPlaceholderText(/enter description/i);
    fireEvent.change(descInput, { target: { value: 'Some details' } });
    expect(descInput).toHaveValue('Some details');
  });

  test('updates the priority when the user selects a different option', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'High' } });
    expect(select).toHaveValue('High');
    fireEvent.change(select, { target: { value: 'Medium' } });
    expect(select).toHaveValue('Medium');
  });

  test('shows an alert and does not call addTodo when title is blank', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    expect(window.alert).toHaveBeenCalledWith('Title cannot be blank');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('shows an alert when title is only whitespace', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    expect(window.alert).toHaveBeenCalledWith('Title cannot be blank');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('calls addTodo with correct arguments on valid submission', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: 'Task Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: 'Task Desc' },
    });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'High' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    expect(mockAddTodo).toHaveBeenCalledWith('Task Title', 'Task Desc', 'High');
  });

  test('resets all fields to defaults after a successful submission', () => {
    render(<AddTodo addTodo={mockAddTodo} />);
    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: 'Task Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: 'Task Desc' },
    });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'High' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    expect(screen.getByPlaceholderText(/enter title/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/enter description/i)).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveValue('Low');
  });
});
