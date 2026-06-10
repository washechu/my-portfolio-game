import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  // StartScreen рендерится только на десктопной ширине (>= 1200px)
  window.innerWidth = 1400;
});

test('рендерит стартовый экран портфолио', () => {
  render(<App />);
  expect(screen.getByText(/Привет, я Никита/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Начать/i })).toBeInTheDocument();
});
