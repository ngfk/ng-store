import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Todo } from '../models/todo';
import { StoreService } from '../services/store.service';

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
