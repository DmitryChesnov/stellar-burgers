import { SELECTORS, API_ROUTES, TEST_DATA } from '../support/constants';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Устанавливаем моки перед каждым тестом с использованием фикстур
    cy.intercept('GET', API_ROUTES.INGREDIENTS, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', API_ROUTES.USER, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', API_ROUTES.ORDERS, {
      fixture: 'order.json'
    }).as('createOrder');

    // Устанавливаем токен авторизации
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.setCookie('accessToken', 'mock-access-token');

    // Посещаем главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage и cookies после каждого теста
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('should load ingredients and display constructor', () => {
    // Проверяем, что страница загрузилась
    cy.contains('Соберите бургер').should('exist');

    // Проверяем, что ингредиенты загрузились
    cy.contains(TEST_DATA.BUN_NAME).should('exist');
    cy.contains(TEST_DATA.MAIN_NAME).should('exist');
    cy.contains(TEST_DATA.SAUCE_NAME).should('exist');

    // Проверяем, что конструктор отображается с пустыми состояниями
    cy.get(SELECTORS.NO_BUNS_TOP).should('exist');
    cy.get(SELECTORS.NO_FILLINGS).should('exist');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('exist');
  });

  it('should add bun to constructor by add button', () => {
    // Находим и кликаем кнопку "Добавить" у булки
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find('button') // Ищем кнопку внутри карточки ингредиента
      .contains('Добавить')
      .click();

    // Проверяем, что булка добавилась в конструктор
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('exist');
    cy.contains(`${TEST_DATA.BUN_NAME} (верх)`).should('exist');
    cy.contains(`${TEST_DATA.BUN_NAME} (низ)`).should('exist');

    // Проверяем, что пустые состояния исчезли
    cy.get(SELECTORS.NO_BUNS_TOP).should('not.exist');
    cy.get(SELECTORS.NO_BUNS_BOTTOM).should('not.exist');
  });

  it('should add filling to constructor by add button', () => {
    // Сначала добавляем булку
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку через кнопку "Добавить"
    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что начинка добавилась
    cy.get(SELECTORS.CONSTRUCTOR_FILLINGS).should('exist');
    cy.contains(TEST_DATA.MAIN_NAME).should('exist');

    // Проверяем, что пустое состояние начинки исчезло
    cy.get(SELECTORS.NO_FILLINGS).should('not.exist');
  });

  it('should open and close ingredient modal', () => {
    // Кликаем на ингредиент чтобы открыть модальное окно
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_OVERLAY).should('exist');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains(TEST_DATA.BUN_NAME).should('exist');

    // Закрываем модальное окно по крестику
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
    cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist');

    // Открываем снова и закрываем по оверлею
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();
    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
    cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist');
  });

  it('should close modal by Escape key', () => {
    // Кликаем на ингредиент чтобы открыть модальное окно
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.MODAL).should('exist');

    // Закрываем модальное окно клавишей Escape
    cy.get('body').type('{esc}', { force: true });

    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.MODAL).should('not.exist');
    cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist');
  });

  it('should create order successfully', () => {
    // Добавляем булку через кнопку "Добавить"
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку через кнопку "Добавить"
    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что кнопка оформления заказа активна и отображается
    cy.get(SELECTORS.ORDER_BUTTON)
      .should('not.be.disabled')
      .and('contain', 'Оформить заказ');

    // Нажимаем кнопку оформления заказа
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно заказа открылось с правильным номером
    cy.get(SELECTORS.MODAL).should('exist');
    cy.contains(TEST_DATA.ORDER_NUMBER).should('exist');
    cy.contains('идентификатор заказа').should('exist');

    // Закрываем модальное окно
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get(SELECTORS.NO_BUNS_TOP).should('exist');
    cy.get(SELECTORS.NO_FILLINGS).should('exist');
  });

  it('should show counter when ingredient is added', () => {
    // Добавляем булку
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что счетчик отображается на булке (2 для булки)
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find(SELECTORS.COUNTER)
      .should('exist')
      .and('contain', '2');

    // Добавляем начинку
    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что счетчик отображается на начинке
    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .find(SELECTORS.COUNTER)
      .should('exist')
      .and('contain', '1');
  });

  it('should add multiple fillings', () => {
    // Добавляем булку
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем несколько начинок
    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get(SELECTORS.INGREDIENT_SAUCE)
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что обе начинки добавились
    cy.get(SELECTORS.CONSTRUCTOR_FILLINGS)
      .should('contain', TEST_DATA.MAIN_NAME)
      .and('contain', TEST_DATA.SAUCE_NAME);
  });
});
