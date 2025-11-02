import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { ingredients, loading, error } = useSelector(
    (state) => state.ingredients
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Используем useEffect с зависимостью от dispatch
  useEffect(() => {
    // Загружаем ингредиенты только если их нет
    if (ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading]);

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
  }

  if (!ingredients || ingredients.length === 0) {
    return <div>Нет доступных ингредиентов</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={ingredients.filter((item) => item.type === 'bun')}
      mains={ingredients.filter((item) => item.type === 'main')}
      sauces={ingredients.filter((item) => item.type === 'sauce')}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
