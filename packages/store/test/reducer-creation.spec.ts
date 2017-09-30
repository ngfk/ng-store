import { expect } from 'chai';

import { Reducer } from '../src/reducer';
import { combineReducers, createReducer, ReducerBuilder } from '../src/reducer-creation';
import { createFilterReducer, Filter } from './models/filter';
import { createTodoReducer, Todo, TodoActionMap } from './models/todo';

describe('reducer-creation', () => {
    describe('ReducerBuilder', () => {
        let builder: ReducerBuilder<Todo[], TodoActionMap>;

        beforeEach(() => {
            builder = new ReducerBuilder();
        });

        it('set initial state', () => {
            const initialState: Todo[] = [
                { id: 0, text: '', completed: false }
            ];

            const reducer = builder.init(initialState).build();
            const state = reducer();

            expect(state).not.eq(initialState);
            expect(state).eql(initialState);
        });

        it('allow adding cases', () => {
            const todoText = '7f3fe268-79cf-5e03-8641-c0034a0afbc4';
            const resultState: Todo[] = [
                {
                    id: 0,
                    text: todoText,
                    completed: false
                }
            ];

            const reducer = builder
                .case('TODO_ADD', (state, payload) => {
                    const todo: Todo = {
                        id: 0,
                        text: payload,
                        completed: false
                    };

                    return [...state, todo];
                })
                .build();
            const state = reducer([], { type: 'TODO_ADD', payload: todoText });

            expect(state).eql(resultState);
        });

        it('allow adding external cases', () => {
            const actionType = '__SOMETHING_NOT_IN_TODO_ACTION_MAP';
            const actionPayload = 10;
            const resultState: Todo[] = [
                {
                    id: actionPayload,
                    text: actionType,
                    completed: false
                }
            ];

            const reducer = builder
                .external(actionType, (state, payload) => {
                    const todo: Todo = {
                        id: payload,
                        text: actionType,
                        completed: false
                    };

                    return [...state, todo];
                })
                .build();
            const state = reducer([], {
                type: actionType,
                payload: actionPayload
            });

            expect(state).eql(resultState);
        });

        it('have payload as second case argument', () => {
            const payloadCheck = 'c3dd924b-c555-53da-8e3e-8bdb4259843d';
            let payloadResult;

            const reducer = builder
                .case('TODO_ADD', (state, payload) => {
                    payloadResult = payload;
                    return state;
                })
                .build();
            reducer([], { type: 'TODO_ADD', payload: payloadCheck });

            expect(payloadResult).eq(payloadCheck);
        });

        it('have action as third case argument', () => {
            const actionCheck = {
                type: 'TODO_ADD',
                payload: '4d3d7fa8-fcf7-59f6-87c5-5eb717261607'
            };
            let actionResult;

            const reducer = builder
                .case('TODO_ADD', (state, _, action) => {
                    actionResult = action;
                    return state;
                })
                .build();
            reducer([], actionCheck);

            expect(actionResult).eq(actionCheck);
            expect(actionResult).eql(actionCheck);
        });
    });

    describe('createReducer', () => {
        it('set initial state', () => {
            const initialState = ['2105f7c7-6101-5d89-878b-ad63415182a1'];

            const reducer = createReducer<any, any>(initialState, {});
            const state = reducer();

            expect(state).not.eq(initialState);
            expect(state).eql(initialState);
        });

        it('allow adding cases', () => {
            type States = { [type in keyof TodoActionMap]: string };
            const initialState = '';
            const resultStates: States = {
                TODO_ADD: 'TODO_ADD',
                TODO_DELETE: 'TODO_DELETE',
                TODO_EDIT: 'TODO_EDIT',
                TODO_COMPLETE: 'TODO_COMPLETE',
                TODO_CLEAR: 'TODO_CLEAR'
            };

            const reducer = createReducer<string, TodoActionMap>(initialState, {
                TODO_ADD: (state, payload) => payload.toString(),
                TODO_DELETE: (state, payload) => payload.toString(),
                TODO_EDIT: (state, payload) => payload.text,
                TODO_COMPLETE: (state, payload) => payload.toString(),
                TODO_CLEAR: (state, payload) => 'TODO_CLEAR'
            });
            const states: States = {
                TODO_ADD: reducer(initialState, {
                    type: 'TODO_ADD',
                    payload: 'TODO_ADD'
                }),
                TODO_DELETE: reducer(initialState, {
                    type: 'TODO_DELETE',
                    payload: 'TODO_DELETE'
                }),
                TODO_EDIT: reducer(initialState, {
                    type: 'TODO_EDIT',
                    payload: { id: '', text: 'TODO_EDIT' }
                }),
                TODO_COMPLETE: reducer(initialState, {
                    type: 'TODO_COMPLETE',
                    payload: 'TODO_COMPLETE'
                }),
                TODO_CLEAR: reducer(initialState, {
                    type: 'TODO_CLEAR',
                    payload: undefined
                })
            };

            Object.keys(states).forEach((action: keyof TodoActionMap) => {
                expect(states[action]).eq(resultStates[action]);
            });
        });
    });

    describe('combineReducers', () => {
        interface State {
            readonly todos: Todo[];
            readonly filter: Filter;
        }

        const initialState: State = {
            todos: [],
            filter: Filter.All
        };
        let reducer: Reducer<State>;

        beforeEach(() => {
            reducer = combineReducers<State>({
                todos: createTodoReducer(initialState.todos),
                filter: createFilterReducer(initialState.filter)
            });
        });

        it('respect initial state', () => {
            const state = reducer();

            expect(state).not.eq(initialState);
            expect(state).eql(initialState);
        });

        it('process actions from child reducers', () => {
            const todoPayload = '70949338-5d59-5b29-96ea-e365d19d6c67';
            const todoAction = { type: 'TODO_ADD', payload: todoPayload };
            const todoResult: State = {
                ...initialState,
                todos: [{ id: 0, text: todoPayload, completed: false }]
            };

            const filterPayload = Filter.Completed;
            const filterAction = { type: 'FILTER_SET', payload: filterPayload };
            const filterResult: State = {
                ...initialState,
                filter: filterPayload
            };

            const todoState = reducer(initialState, todoAction);
            const filterState = reducer(initialState, filterAction);

            expect(todoState).eql(todoResult);
            expect(filterState).eql(filterResult);
        });
    });
});
