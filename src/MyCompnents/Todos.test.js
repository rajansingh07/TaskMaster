import React from 'react';
import { render, screen } from '@testing-library/react';
import Todos from './Todos';

// Keep Todoitem rendering simple by ensuring small-screen path (no framer-motion)
beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 0 });
});

afterAll(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
});

const noop = jest.fn();

const makeTodo = (overrides = {}) => ({
  sno: 1,
  title: 'Sample Todo',
  desc: 'Sample description',
  priority: 'Low',
  completed: false,
  date: '1/1/2025',
  ...overrides,
});

describe('Todos Component', () => {
  test('renders the "Todos List" heading', () => {
    render(<Todos todos={[]} onDelete={noop} onComplete={noop} onEdit={noop} />);
    expect(screen.getByRole('heading', { name: /todos list/i })).toBeInTheDocument();
  });

  test('shows "No todos available" when the list is empty', () => {
    render(<Todos todos={[]} onDelete={noop} onComplete={noop} onEdit={noop} />);
    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });

  test('does not show the empty message when todos exist', () => {
    render(
      <Todos
        todos={[makeTodo()]}
        onDelete={noop}
        onComplete={noop}
        onEdit={noop}
      />
    );
    expect(screen.queryByText(/no todos available/i)).not.toBeInTheDocument();
  });

  test('renders one Todoitem for each todo in the list', () => {
    const todos = [
      makeTodo({ sno: 1, title: 'First Task' }),
      makeTodo({ sno: 2, title: 'Second Task' }),
      makeTodo({ sno: 3, title: 'Third Task' }),
    ];
    render(<Todos todos={todos} onDelete={noop} onComplete={noop} onEdit={noop} />);
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.getByText('Third Task')).toBeInTheDocument();
  });
});
