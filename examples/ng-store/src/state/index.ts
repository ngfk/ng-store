import { combineReducers, Reducer } from '@ngfk/store';

import { Filter } from '../models/filter';
import { Todo } from '../models/todo';
import { FilterActionMap, filterReducer } from './filter.state';
import { TodoActionMap, todoReducer } from './todo.state';

export interface State {
    readonly todos: Todo[];
    readonly filter: Filter;
}

export interface ActionMap extends TodoActionMap, FilterActionMap {}

export const reducer: Reducer<State> = combineReducers<State>({
    todos: todoReducer,
    filter: filterReducer
});
