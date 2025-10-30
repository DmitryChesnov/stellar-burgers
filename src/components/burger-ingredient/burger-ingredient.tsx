import { FC, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Функция добавления ингредиента
    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    // Устанавливаем текущий ингредиент при монтировании, если он соответствует URL
    useEffect(() => {
      if (location.pathname === `/ingredients/${ingredient._id}`) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }, [location, ingredient, dispatch]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
