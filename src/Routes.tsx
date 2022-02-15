import React, { lazy, Suspense } from 'react'
import { useLocation } from 'react-router';
import {
  Switch,
  Route
} from "react-router-dom";
import { ROUTES } from './config/routes';
import ProtectedRoute from './modules/common/components/ProtectedRoute';


const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./modules/auth/pages/RegisterPage'))
const HomePage = lazy(() => import('./modules/home/pages/HomePage'));
const AlbumPage = lazy(() => import('./modules/album/pages/AlbumPage'))
const UserInfoPage = lazy(() => import('./modules/userinfo/pages/UserInfoPage'))


const MainRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch location={location}>
        <Route path={ROUTES.login} component={LoginPage} />
        <ProtectedRoute path={ROUTES.home} component={HomePage} />
        <Route path={ROUTES.userInfo} component={UserInfoPage} />
        <Route path={ROUTES.album} component={AlbumPage}></Route>
        <Route path={ROUTES.register} component={RegisterPage} />
        {/* đổi chỗ thì nó sẽ ưu tiên tìm đến ROUTE "/home" trước nên k cần exact còn nếu để như dưới đây thì nó sẽ chạy đến / trước rồi mới đến /home nên cần exact (exact dùng khi có route có path chứa hoặc tương tự nhau) */}
        <ProtectedRoute exact path="/" component={HomePage} />
      </Switch>
    </Suspense>
  )
}

export default MainRoutes