import { createReducer, Reducer } from '@ngfk/store';

import { Todo } from '../models/todo';

export interface TodoActionMap {
    TODO_ADD: string;
    TODO_DELETE: number;
    TODO_EDIT: { id: number; text: string };
    TODO_COMPLETE: number;
    TODO_CLEAR: undefined;
}

const initial: Todo[] = [];

export const todoReducer: Reducer<Todo[]> = createReducer<
    Todo[],
    TodoActionMap
>(initial, {
    TODO_ADD: (state, payload) => {
        const id =
            state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1;

        const todo: Todo = {
            id,
            text: payload,
            completed: false
        };

        return [todo, ...state];
    },
    TODO_DELETE: (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    },
    TODO_EDIT: (state, payload) => {
        return state.map(todo => {
            return todo.id === payload.id
                ? { ...todo, text: payload.text }
                : todo;
        });
    },
    TODO_COMPLETE: (state, payload) => {
        return state.map(todo => {
            return todo.id === payload
                ? { ...todo, completed: !todo.completed }
                : todo;
        });
    },
    TODO_CLEAR: (state, payload) => {
        return state.filter(todo => !todo.completed);
    }
});
