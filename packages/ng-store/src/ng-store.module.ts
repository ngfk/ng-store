import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { IStore } from '@ngfk/store';

const OPTIONS_TOKEN = new InjectionToken('NgStoreOptions');

export class NgStoreOptions<S, A, T extends IStore<S, A>> {
    store: { new (...d: any[]): T };
    deps?: any[];
}

export function storeFactory(
    options: NgStoreOptions<any, any, any>,
    ...deps: any[]
) {
    return new options.store(...(deps || []));
}

@NgModule({})
export class NgStoreModule {
    public static forRoot<S, A, T extends IStore<S, A>>(
        options: NgStoreOptions<S, A, T>
    ): ModuleWithProviders {
        return {
            ngModule: NgStoreModule,
            providers: [
                {
                    provide: OPTIONS_TOKEN,
                    useValue: options
                },
                {
                    provide: options.store,
                    useFactory: storeFactory,
                    deps: [OPTIONS_TOKEN, ...(options.deps || [])]
                }
            ]
        };
    }
}
