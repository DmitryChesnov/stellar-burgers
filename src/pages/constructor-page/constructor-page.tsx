import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const { loading: ingredientsLoading, ingredients } = useSelector(
    (state) => state.ingredients
  );
  const { loading: userLoading } = useSelector((state) => state.user);

  // Показываем прелоадер пока загружаются ингредиенты или проверяется авторизация
  if (ingredientsLoading || userLoading) {
    return <Preloader />;
  }

  // Если ингредиенты не загружены, показываем ошибку
  if (!ingredients || ingredients.length === 0) {
    return (
      <main className={styles.containerMain}>
        <div className='text text_type_main-medium mt-20'>
          Не удалось загрузить ингредиенты
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
