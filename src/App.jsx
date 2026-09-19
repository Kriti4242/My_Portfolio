import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
