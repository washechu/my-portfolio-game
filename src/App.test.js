import { render, screen } from '@testing-library/react';
import App from './App';

test('на десктопе (>= 1024px) рендерит стартовый экран игры', () => {
  window.innerWidth = 1400;
  render(<App />);
  expect(screen.getByText(/Привет, я Никита/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Начать/i })).toBeInTheDocument();
});

test('на мобиле (< 1024px) рендерит витрину с кейсами и мини-тестом', () => {
  window.innerWidth = 600;
  render(<App />);
  expect(screen.getByText(/Один день в офисе/i)).toBeInTheDocument();
  expect(screen.getByText(/Мини-тест для будущих коллег/i)).toBeInTheDocument();
});
