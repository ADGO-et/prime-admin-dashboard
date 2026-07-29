import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./providers";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import LoginPage from "@/features/auth/components/LoginPage";
import Layout from "@/shared/components/Layout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ApplicationsPage from "@/features/applications/pages/ApplicationsPage";
import ApplicationReviewPage from "@/features/applications/pages/ApplicationReviewPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderReviewPage from "@/features/orders/pages/OrderReviewPage";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/:id" element={<ApplicationReviewPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderReviewPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
