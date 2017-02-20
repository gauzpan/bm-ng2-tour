
import { OtherRouteComponent } from './other-route.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { RouterModule } from '@angular/router';
import { DocsComponent } from './docs.component';
import { DemoComponent } from './demo.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BmTourModule} from "../lib/bm-tour.module";


@NgModule({
  bootstrap: [DemoComponent],
  declarations: [DemoComponent, DocsComponent, OtherRouteComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      component: DocsComponent,
      path: '',
      pathMatch: 'full',
    }, {
      component: OtherRouteComponent,
      path: 'other',
    }]),
    BmTourModule.forRoot(),
    HotkeyModule.forRoot(),
  ],
})
export class DemoModule { }
