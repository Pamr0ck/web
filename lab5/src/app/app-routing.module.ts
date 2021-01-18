import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BrokersComponent} from './brokers/brokers.component';
import {StocksComponent} from './stocks/stocks.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: '', redirectTo: '/brokers', pathMatch: 'full'},
  {path: 'brokers', component: BrokersComponent},
  {path: 'stocks', component: StocksComponent},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})

export class AppRoutingModule {
}
