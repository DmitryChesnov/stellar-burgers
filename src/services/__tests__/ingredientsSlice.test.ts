import { ingredientsReducer, fetchIngredients, setCurrentIngredient, clearCurrentIngredient } from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
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
};

const mockIngredients: TIngredient[] = [
  mockIngredient,
  {
    _id: '2',
    name: 'Test Ingredient 2',
    type: 'sauce',
    proteins: 5,
    fat: 3,
    carbohydrates: 15,
    calories: 80,
    price: 150,
    image: 'test2.jpg',
    image_mobile: 'test2-mobile.jpg',
    image_large: 'test2-large.jpg'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null,
    currentIngredient: null
  };

  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients async actions', () => {
    it('should set loading to true on pending', () => {
      const action = { 
        type: fetchIngredients.pending.type,
        payload: undefined
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        loading: true,
        error: null,
        currentIngredient: null
      });
    });

    it('should set ingredients and loading to false on fulfilled', () => {
      const action = { 
        type: fetchIngredients.fulfilled.type, 
        payload: mockIngredients 
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: mockIngredients,
        loading: false,
        error: null,
        currentIngredient: null
      });
    });

    it('should set error and loading to false on rejected', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = { 
        type: fetchIngredients.rejected.type, 
        error: { message: errorMessage } 
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        loading: false,
        error: errorMessage,
        currentIngredient: null
      });
    });
  });

  describe('current ingredient actions', () => {
    it('should set current ingredient', () => {
      const action = setCurrentIngredient(mockIngredient);
      const state = ingredientsReducer(initialState, action);

      expect(state.currentIngredient).toEqual(mockIngredient);
    });

    it('should clear current ingredient', () => {
      // Сначала устанавливаем ингредиент
      let state = ingredientsReducer(initialState, setCurrentIngredient(mockIngredient));
      expect(state.currentIngredient).toEqual(mockIngredient);

      // Затем очищаем
      state = ingredientsReducer(state, clearCurrentIngredient());
      expect(state.currentIngredient).toBeNull();
    });
  });
});