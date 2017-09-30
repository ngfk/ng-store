import { createReducer } from '../../src/reducer-creation';

export enum Filter {
    All = 'All',
    Active = 'Active',
    Completed = 'Completed'
}

export interface FilterActionMap {
    FILTER_SET: Filter;
}

export const createFilterReducer = (initialState: Filter) =>
    createReducer<Filter, FilterActionMap>(initialState, {
        FILTER_SET: (_, payload) => payload
    });
