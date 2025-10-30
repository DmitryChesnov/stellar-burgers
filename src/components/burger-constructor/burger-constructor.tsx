import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ДОБАВЛЕНО: Хук для навигации
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store'; // ДОБАВЛЕНО: Redux хуки
import { createOrder, clearOrder } from '../../services/slices/orderSlice'; // ДОБАВЛЕНО: Импорт действий
import { clearConstructor } from '../../services/slices/constructorSlice'; // ДОБАВЛЕНО: Импорт действий

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch(); // ДОБАВЛЕНО: Хук dispatch
  const navigate = useNavigate(); // ДОБАВЛЕНО: Хук навигации

  // ИЗМЕНЕНО: Получение данных из store вместо заглушек
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { order, loading: orderRequest } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.user);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    // ДОБАВЛЕНО: Проверка авторизации
    if (!user) {
      navigate('/login');
      return;
    }

    // ДОБАВЛЕНО: Формирование массива id ингредиентов
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TConstructorIngredient) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds)); // ДОБАВЛЕНО: Создание заказа
  };

  const closeOrderModal = () => {
    dispatch(clearOrder()); // ДОБАВЛЕНО: Очистка заказа
    dispatch(clearConstructor()); // ДОБАВЛЕНО: Очистка конструктора
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
