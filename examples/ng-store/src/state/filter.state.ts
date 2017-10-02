import { createReducer, Reducer } from '@ngfk/store';

import { Filter } from '../models/filter';

export interface FilterActionMap {
    FILTER_SET: Filter;
}

const initial: Filter = 'All';

export const filterReducer: Reducer<Filter> = createReducer<
    Filter,
    FilterActionMap
>(initial, {
    FILTER_SET: (_, payload) => payload
});
