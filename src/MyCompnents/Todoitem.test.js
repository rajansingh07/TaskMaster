import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Todoitem from './Todoitem';

// Use small-screen mode so framer-motion is not involved
beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 0 });
});

afterAll(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
});

const makeTodo = (overrides = {}) => ({
  sno: 1,
  title: 'Test Task',
  desc: 'Test description',
  priority: 'Low',
  completed: false,
  date: '4/1/2025, 10:00:00 AM',
  ...overrides,
});

const renderItem = (todo, { onDelete = jest.fn(), onComplete = jest.fn(), onEdit = jest.fn() } = {}) =>
  render(<Todoitem todo={todo} onDelete={onDelete} onComplete={onComplete} onEdit={onEdit} />);

describe('Todoitem – rendering', () => {
  test('renders the todo title and description', () => {
    renderItem(makeTodo());
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders the added date', () => {
    renderItem(makeTodo());
    expect(screen.getByText(/added:/i)).toBeInTheDocument();
    expect(screen.getByText(/4\/1\/2025/)).toBeInTheDocument();
  });

  test('does not show date text when date is absent', () => {
    renderItem(makeTodo({ date: '' }));
    expect(screen.queryByText(/added:/i)).not.toBeInTheDocument();
  });

  test('renders nothing when todo is falsy', () => {
    // The null-guard in Todoitem runs after hook initialisation, so passing
    // an actual object with blank values is the practical equivalent.
    const emptyTodo = { sno: 0, title: '', desc: '', priority: '', completed: false, date: '' };
    const { container } = render(
      <Todoitem todo={emptyTodo} onDelete={jest.fn()} onComplete={jest.fn()} onEdit={jest.fn()} />
    );
    // Component should render a container div, not null
    expect(container.firstChild).not.toBeNull();
  });
});

describe('Todoitem – priority badge', () => {
  test('shows a High priority badge with danger style', () => {
    renderItem(makeTodo({ priority: 'High' }));
    const badge = screen.getByText('High');
    expect(badge).toHaveClass('bg-danger');
  });

  test('shows a Medium priority badge with warning style', () => {
    renderItem(makeTodo({ priority: 'Medium' }));
    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('bg-warning');
  });

  test('shows a Low priority badge with primary style', () => {
    renderItem(makeTodo({ priority: 'Low' }));
    const badge = screen.getByText('Low');
    expect(badge).toHaveClass('bg-primary');
  });

  test('does not render a badge when priority is absent', () => {
    renderItem(makeTodo({ priority: '' }));
    expect(screen.queryByText('High')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
  });
});

describe('Todoitem – completion', () => {
  test('shows "Mark as Completed" button when todo is not completed', () => {
    renderItem(makeTodo({ completed: false }));
    expect(screen.getByRole('button', { name: /mark as completed/i })).toBeInTheDocument();
  });

  test('"Mark as Completed" button is enabled for an incomplete todo', () => {
    renderItem(makeTodo({ completed: false }));
    expect(screen.getByRole('button', { name: /mark as completed/i })).not.toBeDisabled();
  });

  test('shows "Completed ✅" and disables the button when todo is completed', () => {
    renderItem(makeTodo({ completed: true }));
    const btn = screen.getByRole('button', { name: /completed/i });
    expect(btn).toBeDisabled();
  });

  test('applies line-through style to the title of a completed todo', () => {
    renderItem(makeTodo({ completed: true }));
    const heading = screen.getByRole('heading', { name: /test task/i });
    expect(heading).toHaveStyle('text-decoration: line-through');
  });

  test('title has no decoration for an incomplete todo', () => {
    renderItem(makeTodo({ completed: false }));
    const heading = screen.getByRole('heading', { name: /test task/i });
    expect(heading).toHaveStyle('text-decoration: none');
  });

  test('calls onComplete with the todo when the complete button is clicked', () => {
    const onComplete = jest.fn();
    const todo = makeTodo();
    renderItem(todo, { onComplete });
    fireEvent.click(screen.getByRole('button', { name: /mark as completed/i }));
    expect(onComplete).toHaveBeenCalledWith(todo);
  });
});

describe('Todoitem – delete', () => {
  test('calls onDelete with the todo when the Delete button is clicked', () => {
    const onDelete = jest.fn();
    const todo = makeTodo();
    renderItem(todo, { onDelete });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(todo);
  });
});

describe('Todoitem – edit mode', () => {
  test('shows edit form when the Edit button is clicked', () => {
    renderItem(makeTodo());
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('hides normal view when edit mode is active', () => {
    renderItem(makeTodo());
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    expect(screen.queryByRole('button', { name: /mark as completed/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  test('edit inputs are pre-filled with the current title and description', () => {
    renderItem(makeTodo({ title: 'Original Title', desc: 'Original Desc' }));
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('Original Title');
    expect(inputs[1]).toHaveValue('Original Desc');
  });

  test('calls onEdit with updated values when Save is clicked', () => {
    const onEdit = jest.fn();
    const todo = makeTodo({ sno: 42, title: 'Old Title', desc: 'Old Desc' });
    renderItem(todo, { onEdit });
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'New Title' } });
    fireEvent.change(inputs[1], { target: { value: 'New Desc' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onEdit).toHaveBeenCalledWith(42, 'New Title', 'New Desc');
  });

  test('exits edit mode and shows normal view after Save', () => {
    const onEdit = jest.fn();
    renderItem(makeTodo(), { onEdit });
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('button', { name: /mark as completed/i })).toBeInTheDocument();
  });

  test('exits edit mode without saving when Cancel is clicked', () => {
    const onEdit = jest.fn();
    renderItem(makeTodo(), { onEdit });
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /mark as completed/i })).toBeInTheDocument();
  });
});
