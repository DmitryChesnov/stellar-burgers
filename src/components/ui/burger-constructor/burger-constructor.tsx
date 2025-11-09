import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section
    className={styles.burger_constructor}
    data-testid='burger-constructor'
  >
    {' '}
    {/* ДОБАВЛЕНО: data-testid для конструктора */}
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-testid='constructor-bun-top'
      >
        {' '}
        {/* ДОБАВЛЕНО: data-testid для верхней булки */}
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-testid='no-buns-top' /* ДОБАВЛЕНО: data-testid для пустой верхней булки */
      >
        Выберите булки
      </div>
    )}
    <ul className={styles.elements} data-testid='constructor-fillings'>
      {' '}
      {/* ДОБАВЛЕНО: data-testid для начинок */}
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='no-fillings' /* ДОБАВЛЕНО: data-testid для пустой начинки */
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mt-4 mr-4`}
        data-testid='constructor-bun-bottom'
      >
        {' '}
        {/* ДОБАВЛЕНО: data-testid для нижней булки */}
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-testid='no-buns-bottom' /* ДОБАВЛЕНО: data-testid для пустой нижней булки */
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
        data-testid='order-button' /* ДОБАВЛЕНО: data-testid для кнопки заказа */
      />
    </div>
    {orderRequest && (
      <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
        <Preloader />
      </Modal>
    )}
    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
        data-testid='order-modal' /* ДОБАВЛЕНО: data-testid для модального окна заказа */
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
