import { FC, useMemo, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

// ДОБАВЛЕНО: Тип для данных заказа с дополнительной информацией
type TOrderInfoData = TOrder & {
  ingredientsInfo: {
    [key: string]: TIngredient & { count: number };
  };
  date: Date;
  total: number;
};

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (number) {
        try {
          const response = await getOrderByNumberApi(parseInt(number));
          if (response.success && response.orders.length > 0) {
            setOrderData(response.orders[0]);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const ingredientsArray = Object.values(ingredientsInfo) as (TIngredient & {
      count: number;
    })[];

    const total = ingredientsArray.reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    } as TOrderInfoData;
  }, [orderData, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return (
    <div>
      {/* ДОБАВЛЕНО: Отображение номера заказа без стилей */}
      <p
        className='text text_type_digits-default mb-10'
        style={{ textAlign: 'center' }}
      >
        #{orderInfo.number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
