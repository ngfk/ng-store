import { ModuleWithProviders, NgModule } from '@angular/core';
import { IStore, Store } from '@ngfk/store';

export class NgStoreConfig<S, A, T extends IStore<S, A>> {
    store?: {
        provide: { new (...d: any[]): T };
        useFactory: Function;
        deps?: any[];
    };
}

@NgModule({})
export class NgStoreModule {
    public static forRoot<S, A, T extends IStore<S, A>>(
        config: NgStoreConfig<S, A, T>
    ): ModuleWithProviders {
        return {
            ngModule: NgStoreModule,
            providers: [config.store || Store]
        };
    }
}
