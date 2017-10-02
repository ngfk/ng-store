import { Injectable } from '@angular/core';
import { Store } from '@ngfk/store';

import { ActionMap, reducer, State } from '../state';

@Injectable()
export class StoreService extends Store<State, ActionMap> {
    constructor() {
        super(reducer);
    }
}
