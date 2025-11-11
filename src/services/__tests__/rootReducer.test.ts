import { rootReducer } from '../rootReducer';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { createOrder } from '../slices/orderSlice';
import { loginUser } from '../slices/userSlice';
import { fetchFeeds } from '../slices/feedSlice';
import { fetchProfileOrders } from '../slices/profileOrdersSlice';

describe('rootReducer', () => {
  it('should return initial state with all reducers', () => {
    const initialState = rootReducer(undefined, { type: '' });

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null,
        currentIngredient: null
      },
      order: {
        order: null,
        loading: false,
        error: null
      },
      user: {
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      }
    });
  });

  it('should handle actions from different slices', () => {
    let state = rootReducer(undefined, { type: '' });

    // Проверяем начальное состояние
    expect(state.ingredients.loading).toBe(false);
    expect(state.order.loading).toBe(false);
    expect(state.user.loading).toBe(false);
    expect(state.feed.loading).toBe(false);
    expect(state.profileOrders.loading).toBe(false);

    // Тестируем pending экшен из ingredients слайса
    const ingredientsPendingAction = {
      type: fetchIngredients.pending.type,
      payload: undefined
    };
    state = rootReducer(state, ingredientsPendingAction);
    expect(state.ingredients.loading).toBe(true);
    expect(state.order.loading).toBe(false); // Другие редьюсеры не должны измениться

    // Тестируем pending экшен из feed слайса
    state = rootReducer(undefined, { type: '' }); // сбрасываем состояние
    const feedPendingAction = {
      type: fetchFeeds.pending.type,
      payload: undefined
    };
    state = rootReducer(state, feedPendingAction);
    expect(state.feed.loading).toBe(true);
    expect(state.ingredients.loading).toBe(false);

    // Тестируем pending экшен из profileOrders слайса
    state = rootReducer(undefined, { type: '' }); // сбрасываем состояние
    const profileOrdersPendingAction = {
      type: fetchProfileOrders.pending.type,
      payload: undefined
    };
    state = rootReducer(state, profileOrdersPendingAction);
    expect(state.profileOrders.loading).toBe(true);
    expect(state.feed.loading).toBe(false);
  });

  it('should handle fulfilled actions correctly', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Test Ingredient',
        type: 'main',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 200,
        image: 'test.jpg',
        image_mobile: 'test-mobile.jpg',
        image_large: 'test-large.jpg'
      }
    ];

    const ingredientsFulfilledAction = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = rootReducer(undefined, ingredientsFulfilledAction);

    expect(state.ingredients.ingredients).toEqual(mockIngredients);
    expect(state.ingredients.loading).toBe(false);
    expect(state.ingredients.error).toBe(null);
  });

  it('should handle rejected actions correctly', () => {
    const errorMessage = 'Test error message';
    const ingredientsRejectedAction = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };

    const state = rootReducer(undefined, ingredientsRejectedAction);

    expect(state.ingredients.error).toBe(errorMessage);
    expect(state.ingredients.loading).toBe(false);
    expect(state.ingredients.ingredients).toEqual([]);
  });

  it('should handle order creation actions', () => {
    const mockOrder = {
      _id: 'order1',
      ingredients: ['ing1', 'ing2'],
      status: 'done',
      name: 'Test Order',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12345
    };

    // Тестируем pending
    let state = rootReducer(undefined, {
      type: createOrder.pending.type,
      payload: undefined
    });
    expect(state.order.loading).toBe(true);

    // Тестируем fulfilled
    state = rootReducer(state, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });
    expect(state.order.loading).toBe(false);
    expect(state.order.order).toEqual(mockOrder);
    expect(state.order.error).toBe(null);

    // Тестируем rejected
    state = rootReducer(undefined, {
      type: createOrder.rejected.type,
      error: { message: 'Order creation failed' }
    });
    expect(state.order.loading).toBe(false);
    expect(state.order.error).toBe('Order creation failed');
  });

  it('should handle user login actions', () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User'
    };

    // Тестируем pending
    let state = rootReducer(undefined, {
      type: loginUser.pending.type,
      payload: undefined
    });
    expect(state.user.loading).toBe(true);

    // Тестируем fulfilled
    state = rootReducer(state, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.user.loading).toBe(false);
    expect(state.user.user).toEqual(mockUser);
    expect(state.user.isAuthChecked).toBe(true);
    expect(state.user.error).toBe(null);
  });
});