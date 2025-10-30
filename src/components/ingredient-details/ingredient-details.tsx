import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import {
  setCurrentIngredient,
  clearCurrentIngredient,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  // Получаем все ингредиенты и текущий ингредиент из store
  const { ingredients, currentIngredient, loading } = useSelector(
    (state) => state.ingredients
  );

  // Загружаем ингредиенты если их нет в store
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients.length, dispatch]);

  // Находим ингредиент по ID из URL параметров
  useEffect(() => {
    if (id && ingredients.length > 0) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }
  }, [id, ingredients, dispatch]);

  // Очищаем текущий ингредиент при размонтировании
  useEffect(
    () => () => {
      dispatch(clearCurrentIngredient());
    },
    [dispatch]
  );

  // Показываем загрузку если данные еще грузятся
  if (loading) {
    return <Preloader />;
  }

  // Если ингредиент не найден после загрузки, показываем ошибку
  if (!currentIngredient && ingredients.length > 0) {
    return (
      <div className='text text_type_main-medium mt-20'>
        Ингредиент не найден
      </div>
    );
  }

  // Если ингредиенты еще не загружены, показываем загрузку
  if (!currentIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={currentIngredient} />;
};
