import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Todo } from '../models/todo';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'my-component',
    template: `
        <div>
            <pre>{{todos$ | async | json}}</pre>
            <button (click)="dispatch">dispatch</button>
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
}
