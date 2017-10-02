import { NgModule } from '@angular/core';
import { NgStoreModule } from '@ngfk/ng-store';

import { StoreService } from '../services/store.service';
import { reducer } from '../state';

@NgModule({
    imports: [
        NgStoreModule.forRoot({
            store: StoreService,
            reducer: reducer
        })
    ]
})
export class AppModule {}
