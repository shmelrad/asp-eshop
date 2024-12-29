import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from '@/components/navBar';
import Products from '@/pages/Products';
import LoginPage from '@/pages/LoginPage';
import ManageProducts from '@/pages/admin/ManageProducts';
import ProtectedRoute from '@/components/protectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container mx-auto px-4">
        <Routes>
          <Route index element={<Products />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <ManageProducts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;