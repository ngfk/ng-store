# Ng-Store

State management powered by [RxJS](https://github.com/ReactiveX/rxjs) enforcing type safety, inspired by [`@ngrx/store`](https://github.com/ngrx/platform) and [`Redux`](http://redux.js.org). Creating reducers and dispatching actions will be type safe.

## Setup

1. Define state structure
2. Map actions
3. Create reducers
4. Create store

### 1. Define state structure

```typescript
interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

enum Filter {
    All,
    Completed,
    Active
}

interface State {
    readonly todos: Todo[];
    readonly filter: Filter;
}
```

### 2. Map actions

```typescript
interface TodoActionMap {
    TODO_ADD: { id: number; text: string };
    TODO_TOGGLE: number;
    TODO_REMOVE: number;
}

interface FilterActionMap {
    FILTER_SET: Filter;
}

interface ActionMap extends TodoActionMap, FilterActionMap {}
```

### 3. Create reducers

```typescript
const todoReducer = createReducer<Todo[], TodoActionMap>([], {
    TODO_ADD: (state, payload) => [
        ...state,
        { id: payload.id, text: payload.text, completed: false }
    ],
    TODO_TOGGLE: (state, payload) => {
        return state.map(
            todo =>
                todo.id === payload
                    ? { ...todo, completed: !todo.completed }
                    : todo
        );
    },
    TODO_REMOVE: (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    }
});

const filterReducer = createReducer<Filter, FilterActionMap>(Filter.All, {
    FILTER_SET: (_, payload) => payload
});

const reducer = combineReducers<State>({
    todos: todoReducer,
    filter: filterReducer
});
```

### 4. Create store service

```typescript
import { Injectable } from '@angular/core';
import { NgStore } from '@ngfk/ng-store';

@Injectable()
export class StoreService extends NgStore<State, ActionMap> {
    constructor() {
        super(reducer);
    }
}
```

> Make sure to provide this service in your `NgModule`.

## Example Usage
```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'my-component',
    template: `
        <div>
            <pre>{{todos$ | async | json}}</pre>
            <button (click)="dispatch">dispatch</button>
        </div>
    `,
})
export class MyComponent {

    public todos$: Observable<Todo[]>;

    constructor(private store: StoreService) {
        this.todos$ = this.store.select(state => state.todos);
    }

    public dispatch(): void {
        this.store.dispatch('TODO_ADD', {
            id: 0,
            text: 'Dispatched TODO!'
        });
    }
}
```