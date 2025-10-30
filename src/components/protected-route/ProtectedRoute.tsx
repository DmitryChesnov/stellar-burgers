import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean; // ДОБАВЛЕНО: Флаг для маршрутов только для неавторизованных
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const user = useSelector((state) => state.user.user); // ДОБАВЛЕНО: Получение пользователя из store
  const location = useLocation();

  // ДОБАВЛЕНО: Редирект для авторизованных пользователей на маршрутах только для неавторизованных
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  // ДОБАВЛЕНО: Редирект для неавторизованных пользователей на защищенные маршруты
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
