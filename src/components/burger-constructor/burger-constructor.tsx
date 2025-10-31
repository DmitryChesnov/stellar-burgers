import { FC, useMemo, useEffect } from 'react'; // ДОБАВЛЕНО: useEffect
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { order, loading: orderRequest } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.user);

  // ДОБАВЛЕНО: Очистка конструктора при успешном создании заказа
  useEffect(() => {
    if (order && order.number) {
      // Заказ успешно создан - очищаем конструктор
      dispatch(clearConstructor());
    }
  }, [order, dispatch]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TConstructorIngredient) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    // ИЗМЕНЕНО: Очищаем только данные заказа, НЕ конструктор
    dispatch(clearOrder());
    // Конструктор теперь очищается автоматически при успешном ответе от сервера
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
