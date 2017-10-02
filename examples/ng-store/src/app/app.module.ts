import { NgModule } from '@angular/core';
import { NgStoreModule } from '@ngfk/ng-store';

import { StoreService } from '../services/store.service';

@NgModule({
    imports: [
        NgStoreModule.forRoot({
            store: StoreService
        })
    ]
})
export class AppModule {}
