import { ModuleWithProviders, NgModule } from '@angular/core';
import { Reducer } from '@ngfk/store';

import { NgStoreConstructor } from './ng-store';

@NgModule({})
export class NgStoreModule {
    public static forRoot<
        State,
        Store extends NgStoreConstructor<State>
    >(options: {
        readonly store: Store;
        readonly reducer: Reducer<State>;
        readonly initialState?: State;
    }): ModuleWithProviders {
        return {
            ngModule: NgStoreModule,
            providers: [
                {
                    provide: options.store,
                    useFactory: function storeFactory() {
                        return new options.store(
                            options.reducer,
                            options.initialState
                        );
                    }
                }
            ]
        };
    }
}
