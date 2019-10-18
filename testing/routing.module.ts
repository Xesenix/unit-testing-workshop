import { Location } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

@Component({ template: '' }) class BlankComponent {}

@NgModule({
  declarations: [
    BlankComponent,
  ],
  imports: [
    // we can setup routing environment for our test with use of RouterTestingModule
    RouterTestingModule.withRoutes([
      { path: '', component: BlankComponent },
      { path: 'home', component: BlankComponent },
      { path: 'redirect/url', component: BlankComponent },
      { path: 'somewhere-else', component: BlankComponent },
      { path: 'logout', outlet: 'modal', component: BlankComponent },
      { path: 'bankid', outlet: 'modal', component: BlankComponent },
      { path: 'new-terms', outlet: 'modal', component: BlankComponent },
    ]),
  ],
  providers: [
    {
      provide: Location,
      useClass: SpyLocation,
    }
  ]
})
export class RoutingTestingModule {
}