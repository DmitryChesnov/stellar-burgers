export const SELECTORS = {
  // Ингредиенты
  INGREDIENT_BUN: '[data-testid="ingredient-bun"]',
  INGREDIENT_MAIN: '[data-testid="ingredient-main"]',
  INGREDIENT_SAUCE: '[data-testid="ingredient-sauce"]',
  INGREDIENT_ITEM: '[data-testid="ingredient-item"]',
  
  // Конструктор
  BURGER_CONSTRUCTOR: '[data-testid="burger-constructor"]',
  CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]',
  CONSTRUCTOR_FILLINGS: '[data-testid="constructor-fillings"]',
  NO_BUNS_TOP: '[data-testid="no-buns-top"]',
  NO_BUNS_BOTTOM: '[data-testid="no-buns-bottom"]',
  NO_FILLINGS: '[data-testid="no-fillings"]',
  
  // Кнопки
  ORDER_BUTTON: '[data-testid="order-button"]',
  ADD_BUTTON: 'button:contains("Добавить")',
  
  // Модальные окна
  MODAL: '[data-testid="modal"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  MODAL_CLOSE_BUTTON: '[data-testid="modal-close-button"]',
  
  // Счетчики
  COUNTER: '[class*="counter"]'
};

export const API_ROUTES = {
  INGREDIENTS: '**/api/ingredients',
  USER: '**/api/auth/user', 
  ORDERS: '**/api/orders'
};

export const TEST_DATA = {
  ORDER_NUMBER: '12345',
  BUN_NAME: 'Краторная булка N-200i',
  MAIN_NAME: 'Биокотлета из марсианской Магнолии',
  SAUCE_NAME: 'Соус Spicy-X'
};