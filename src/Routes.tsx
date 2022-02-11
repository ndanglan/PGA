import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { ROUTES } from './config/routes';
import ProtectedRoute from './modules/common/components/ProtectedRoute';
type Props = {}

const HomePage = lazy(() => import('./modules/home/pages/HomePage'));

const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));


const MainRoutes = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.home} element={<HomePage />} />
          </Route>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default MainRoutes