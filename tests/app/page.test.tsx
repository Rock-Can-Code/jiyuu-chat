import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/app/page';

describe('App', () => {

  test('renders ready message after loading', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Go!')).toBeInTheDocument());
  });

  test('sends message when form is submitted', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<App />);
    const textarea = getByPlaceholderText('Type your message here...');
    const submitButton = getByRole('button');

    fireEvent.change(textarea, { target: { value: 'Hello, AI!' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText('Hello, AI!')).toBeInTheDocument());
  });

});
