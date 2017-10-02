import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgStoreModule } from '@ngfk/ng-store';

import { StoreService } from '../services/store.service';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NgStoreModule.forRoot({
            store: StoreService
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
