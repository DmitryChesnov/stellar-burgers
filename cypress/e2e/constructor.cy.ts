describe('Burger Constructor', () => {
  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ];

  const mockUser = {
    success: true,
    user: {
      email: 'test@example.com',
      name: 'Test User'
    }
  };

  const mockOrderResponse = {
    success: true,
    name: 'Space spicy burger',
    order: {
      number: 12345
    }
  };

  beforeEach(() => {
    // Устанавливаем моки перед каждым тестом
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: mockIngredients
      }
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: mockUser
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: mockOrderResponse
    }).as('createOrder');

    // Устанавливаем токен авторизации
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.setCookie('accessToken', 'mock-access-token');

    // Посещаем главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('should load ingredients and display constructor', () => {
    // Проверяем, что страница загрузилась
    cy.contains('Соберите бургер').should('exist');
    
    // Проверяем, что ингредиенты загрузились
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Соус Spicy-X').should('exist');

    // Проверяем, что конструктор отображается с пустыми состояниями
    cy.get('[data-testid="no-buns-top"]').should('exist');
    cy.get('[data-testid="no-fillings"]').should('exist');
    cy.get('[data-testid="burger-constructor"]').should('exist');
  });

  it('should add bun to constructor by add button', () => {
    // Находим и кликаем кнопку "Добавить" у булки
    cy.get('[data-testid="ingredient-bun"]').first()
      .find('button') // Ищем кнопку внутри карточки ингредиента
      .contains('Добавить')
      .click();

    // Проверяем, что булка добавилась в конструктор
    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
    
    // Проверяем, что пустые состояния исчезли
    cy.get('[data-testid="no-buns-top"]').should('not.exist');
    cy.get('[data-testid="no-buns-bottom"]').should('not.exist');
  });

  it('should add filling to constructor by add button', () => {
    // Сначала добавляем булку
    cy.get('[data-testid="ingredient-bun"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку через кнопку "Добавить"
    cy.get('[data-testid="ingredient-main"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что начинка добавилась
    cy.get('[data-testid="constructor-fillings"]').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    
    // Проверяем, что пустое состояние начинки исчезло
    cy.get('[data-testid="no-fillings"]').should('not.exist');
  });

  it('should open and close ingredient modal', () => {
    // Кликаем на ингредиент чтобы открыть модальное окно
    cy.get('[data-testid="ingredient-item"]').first().click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal-overlay"]').should('exist');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');

    // Закрываем модальное окно по крестику
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="modal-overlay"]').should('not.exist');

    // Открываем снова и закрываем по оверлею
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="modal-overlay"]').should('not.exist');
  });

  it('should create order successfully', () => {
    // Добавляем булку через кнопку "Добавить"
    cy.get('[data-testid="ingredient-bun"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку через кнопку "Добавить"
    cy.get('[data-testid="ingredient-main"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что кнопка оформления заказа активна и отображается
    cy.get('[data-testid="order-button"]')
      .should('not.be.disabled')
      .and('contain', 'Оформить заказ');

    // Нажимаем кнопку оформления заказа
    cy.get('[data-testid="order-button"]').click();

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно заказа открылось с правильным номером
    cy.get('[data-testid="modal"]').should('exist');
    cy.contains('12345').should('exist');
    cy.contains('идентификатор заказа').should('exist');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-testid="no-buns-top"]').should('exist');
    cy.get('[data-testid="no-fillings"]').should('exist');
  });

  it('should show counter when ingredient is added', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-bun"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что счетчик отображается на булке (2 для булки)
    cy.get('[data-testid="ingredient-bun"]').first()
      .find('[class*="counter"]') // Ищем элемент счетчика
      .should('exist')
      .and('contain', '2'); // Булки всегда добавляются в количестве 2

    // Добавляем начинку
    cy.get('[data-testid="ingredient-main"]').first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что счетчик отображается на начинке
    cy.get('[data-testid="ingredient-main"]').first()
      .find('[class*="counter"]')
      .should('exist')
      .and('contain', '1'); // Начинки добавляются по одной
  });
});