import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

test('renderiza la pantalla de inicio de sesion', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /iniciar sesión/i });
  expect(titleElement).toBeInTheDocument();
});
