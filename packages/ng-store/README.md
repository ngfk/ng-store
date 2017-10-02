# @ngfk/ng-store

State management powered by [RxJS](https://github.com/ReactiveX/rxjs) enforcing type safety, inspired by [`@ngrx/store`](https://github.com/ngrx/platform) and [`Redux`](http://redux.js.org). Creating reducers and dispatching actions will be type safe.

[![npm version](https://img.shields.io/npm/v/@ngfk/ng-store.svg)](https://www.npmjs.com/package/@ngfk/ng-store)

## Setup

[TLDR](examples/ng-store)
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
const todosReducer = createReducer<Todo[], TodoActionMap>([], {
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
    todos: todosReducer,
    filter: filterReducer
});
```

### 4. Create store service & provide it

```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngfk/store';

import { ActionMap, reducer, State } from '../state';

@Injectable()
export class StoreService extends Store<State, ActionMap> {
    constructor() {
        super(reducer);
    }
}
```

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgStoreModule } from '@ngfk/ng-store';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NgStoreModule.forRoot({
            store: StoreService
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## Example Usage
```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-root',
    template: `
        <div>
            <button (click)="dispatch()">dispatch</button>
            <button (click)="clear()">clear</button>
            <hr>
            <p>State:</p>
            <pre>{{todos$ | async | json}}</pre>
        </div>
    `
})
export class AppComponent {
    public todos$: Observable<Todo[]>;

    constructor(private store: StoreService) {
        this.todos$ = this.store.select(state => state.todos);
    }

    public dispatch(): void {
        this.store.dispatch('TODO_ADD', 'Dispatched TODO!');
    }

    public clear(): void {
        this.store.reset();
    }
}
```
