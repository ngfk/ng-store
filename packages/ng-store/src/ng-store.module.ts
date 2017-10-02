import { ModuleWithProviders, NgModule } from '@angular/core';
import { Store } from '@ngfk/store';

export type StoreConstructor<State> = {
    new (...args: any[]): Store<State, any>;
};

@NgModule({})
export class NgStoreModule {
    public static forRoot<
        Store extends StoreConstructor<State>,
        State
    >(options: {
        readonly store: Store;
        readonly deps?: any[];
    }): ModuleWithProviders {
        return {
            ngModule: NgStoreModule,
            providers: [
                {
                    provide: options.store,
                    useFactory: function storeFactory(...deps: any[]) {
                        return new options.store(...deps);
                    },
                    deps: options.deps
                }
            ]
        };
    }
}
