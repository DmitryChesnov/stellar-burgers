import { constructorReducer } from '../slices/constructorSlice';
import {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: 'bun.jpg',
  image_mobile: 'bun-mobile.jpg',
  image_large: 'bun-large.jpg'
};

const mockIngredient: TIngredient = {
  _id: 'ingredient1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 100,
  image: 'ingredient.jpg',
  image_mobile: 'ingredient-mobile.jpg',
  image_large: 'ingredient-large.jpg'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addBun', () => {
    it('should handle adding a bun', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('should replace existing bun when adding new one', () => {
      const firstBun = { ...mockBun, _id: 'bun1' };
      const secondBun = { ...mockBun, _id: 'bun2' };

      let state = constructorReducer(initialState, addBun(firstBun));
      state = constructorReducer(state, addBun(secondBun));

      expect(state.bun).toEqual(secondBun);
      expect(state.bun?._id).toBe('bun2');
    });
  });

  describe('addIngredient', () => {
    it('should handle adding an ingredient with generated id', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient
      });
      expect(state.ingredients[0].id).toMatch(
        new RegExp(`${mockIngredient._id}-\\d+`)
      );
    });

    it('should add multiple ingredients', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const secondIngredient = { ...mockIngredient, _id: 'ingredient2' };
      state = constructorReducer(state, addIngredient(secondIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe('ingredient1');
      expect(state.ingredients[1]._id).toBe('ingredient2');
    });
  });

  describe('removeIngredient', () => {
    it('should handle removing an ingredient by id', () => {
      // Сначала добавляем ингредиенты
      const addAction1 = addIngredient(mockIngredient);
      let state = constructorReducer(initialState, addAction1);

      const secondIngredient = { ...mockIngredient, _id: 'ingredient2' };
      const addAction2 = addIngredient(secondIngredient);
      state = constructorReducer(state, addAction2);

      expect(state.ingredients).toHaveLength(2);

      // Удаляем первый ингредиент
      const ingredientIdToRemove = state.ingredients[0].id;
      const removeAction = removeIngredient(ingredientIdToRemove);
      state = constructorReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('ingredient2');
    });

    it('should not remove anything if id not found', () => {
      const addAction = addIngredient(mockIngredient);
      let state = constructorReducer(initialState, addAction);

      const removeAction = removeIngredient('non-existent-id');
      state = constructorReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('should handle moving ingredients', () => {
      // Добавляем три ингредиента
      const ingredient1 = { ...mockIngredient, _id: 'ing1' };
      const ingredient2 = { ...mockIngredient, _id: 'ing2' };
      const ingredient3 = { ...mockIngredient, _id: 'ing3' };

      let state = constructorReducer(initialState, addIngredient(ingredient1));
      state = constructorReducer(state, addIngredient(ingredient2));
      state = constructorReducer(state, addIngredient(ingredient3));

      expect(state.ingredients[0]._id).toBe('ing1');
      expect(state.ingredients[1]._id).toBe('ing2');
      expect(state.ingredients[2]._id).toBe('ing3');

      // Перемещаем первый элемент на позицию второго
      const moveAction = moveIngredient({ from: 0, to: 1 });
      state = constructorReducer(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing2');
      expect(state.ingredients[1]._id).toBe('ing1');
      expect(state.ingredients[2]._id).toBe('ing3');
    });

    it('should handle moving to the same position', () => {
      const ingredient1 = { ...mockIngredient, _id: 'ing1' };
      const ingredient2 = { ...mockIngredient, _id: 'ing2' };

      let state = constructorReducer(initialState, addIngredient(ingredient1));
      state = constructorReducer(state, addIngredient(ingredient2));

      const originalOrder = [...state.ingredients];

      const moveAction = moveIngredient({ from: 0, to: 0 });
      state = constructorReducer(state, moveAction);

      expect(state.ingredients).toEqual(originalOrder);
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      state = constructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
