import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store'; // ДОБАВЛЕНО: импорт useDispatch
import { removeIngredient } from '../../services/slices/constructorSlice'; // ДОБАВЛЕНО: импорт action

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // ДОБАВЛЕНО: получение dispatch

    const handleMoveDown = () => {};

    const handleMoveUp = () => {};

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose} // ДОБАВЛЕНО: передача функции удаления в UI компонент
      />
    );
  }
);
