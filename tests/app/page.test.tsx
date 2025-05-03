import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/app/page';

// Mock the MLCEngine and other dependencies
jest.mock('@mlc-ai/web-llm', () => ({
  CreateMLCEngine: jest.fn(() => ({
    reload: Promise.resolve(),
    resetChat: Promise.resolve(),
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => <pre>{children}</pre>
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('renders ready message after loading', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Go!')).toBeInTheDocument());
  });

  test('renders error message when model fails to load', async () => {
    require('@mlc-ai/web-llm').CreateMLCEngine.mockImplementationOnce(() => {
      throw new Error('Load failed');
    });
    
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Ocurrió un error al cargar el modelo/i)).toBeInTheDocument();
      expect(screen.getByText(/Try to reload the page/i)).toBeInTheDocument();
    });
  });

  test('submits user message and displays it', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  test('disables submit button when input is empty', () => {
    render(<App />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('enables submit button when input has content', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(button).not.toBeDisabled();
  });

  test('resets form after submission', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});