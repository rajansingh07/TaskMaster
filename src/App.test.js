import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children, initial, animate, exit, transition, layout, ...rest }) =>
        React.createElement('div', rest, children),
    },
    AnimatePresence: ({ children }) => children,
  };
});

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  // Re-apply per-test mocks after clearAllMocks so they are fresh and present
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
});

const renderApp = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );

describe('App – Initial Rendering', () => {
  test('renders the search input', () => {
    renderApp();
    expect(screen.getByPlaceholderText(/search todos/i)).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    renderApp();
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^completed$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pending$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export json/i })).toBeInTheDocument();
  });

  test('shows "No todos available" when the list is empty', () => {
    renderApp();
    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });
});

describe('App – localStorage', () => {
  test('loads todos from localStorage on mount', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { sno: 1, title: 'Saved Todo', desc: 'some desc', priority: 'Low', completed: false, date: '' },
      ])
    );
    renderApp();
    expect(screen.getByText('Saved Todo')).toBeInTheDocument();
  });

  test('persists state changes to localStorage', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { sno: 1, title: 'Done Task', desc: '', priority: 'Low', completed: true, date: '' },
      ])
    );
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(JSON.parse(localStorage.getItem('todos'))).toHaveLength(0);
  });
});

describe('App – Filtering', () => {
  const mixedTodos = [
    { sno: 1, title: 'Active Task', desc: '', priority: 'Low', completed: false, date: '' },
    { sno: 2, title: 'Done Task', desc: '', priority: 'Low', completed: true, date: '' },
  ];

  beforeEach(() => {
    localStorage.setItem('todos', JSON.stringify(mixedTodos));
  });

  test('shows all todos by default', () => {
    renderApp();
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  test('shows only completed todos when Completed filter is active', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    expect(screen.getByText('Done Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();
  });

  test('shows only pending todos when Pending filter is active', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /^pending$/i }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Done Task')).not.toBeInTheDocument();
  });

  test('shows all todos again after switching back to All', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });
});

describe('App – Search', () => {
  beforeEach(() => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { sno: 1, title: 'Buy groceries', desc: 'fruits and vegetables', priority: 'Low', completed: false, date: '' },
        { sno: 2, title: 'Read book', desc: 'fiction novel', priority: 'Low', completed: false, date: '' },
      ])
    );
  });

  test('filters todos by title', () => {
    renderApp();
    fireEvent.change(screen.getByPlaceholderText(/search todos/i), {
      target: { value: 'groceries' },
    });
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Read book')).not.toBeInTheDocument();
  });

  test('filters todos by description', () => {
    renderApp();
    fireEvent.change(screen.getByPlaceholderText(/search todos/i), {
      target: { value: 'fiction' },
    });
    expect(screen.getByText('Read book')).toBeInTheDocument();
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
  });

  test('search is case-insensitive', () => {
    renderApp();
    fireEvent.change(screen.getByPlaceholderText(/search todos/i), {
      target: { value: 'GROCERIES' },
    });
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  test('shows all todos when search is cleared', () => {
    renderApp();
    const input = screen.getByPlaceholderText(/search todos/i);
    fireEvent.change(input, { target: { value: 'groceries' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Read book')).toBeInTheDocument();
  });
});

describe('App – Clear Completed', () => {
  test('removes only completed todos', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { sno: 1, title: 'Keep Me', desc: '', priority: 'Low', completed: false, date: '' },
        { sno: 2, title: 'Remove Me', desc: '', priority: 'Low', completed: true, date: '' },
      ])
    );
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(screen.getByText('Keep Me')).toBeInTheDocument();
    expect(screen.queryByText('Remove Me')).not.toBeInTheDocument();
  });

  test('does nothing when there are no completed todos', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { sno: 1, title: 'Active Task', desc: '', priority: 'Low', completed: false, date: '' },
      ])
    );
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
  });
});

describe('App – Export', () => {
  test('clicking Export JSON triggers URL.createObjectURL', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /export json/i }));
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });
});

describe('App – Import', () => {
  let OriginalFileReader;

  beforeEach(() => {
    OriginalFileReader = global.FileReader;
  });

  afterEach(() => {
    global.FileReader = OriginalFileReader;
  });

  const mockFileReaderWith = (content) => {
    global.FileReader = function () {};
    global.FileReader.prototype.readAsText = function () {
      this.onload({ target: { result: content } });
    };
  };

  test('imports a valid JSON array and renders the todos', () => {
    const importedTodos = [
      { sno: 1, title: 'Imported Task', desc: 'imported desc', priority: 'High', completed: false, date: '' },
    ];
    mockFileReaderWith(JSON.stringify(importedTodos));

    renderApp();
    const file = new File([JSON.stringify(importedTodos)], 'todos.json', {
      type: 'application/json',
    });
    const fileInput = document.querySelector('input[type="file"]');

    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText('Imported Task')).toBeInTheDocument();
  });

  test('shows no change when the JSON is not an array', () => {
    mockFileReaderWith(JSON.stringify({ title: 'not an array' }));

    renderApp();
    const file = new File(['{}'], 'todos.json', { type: 'application/json' });
    const fileInput = document.querySelector('input[type="file"]');

    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });

  test('handles invalid JSON gracefully', () => {
    mockFileReaderWith('not valid json {{{{');

    renderApp();
    const file = new File(['bad'], 'todos.json', { type: 'application/json' });
    const fileInput = document.querySelector('input[type="file"]');

    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });

  test('does nothing when no file is selected', () => {
    renderApp();
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });
});
