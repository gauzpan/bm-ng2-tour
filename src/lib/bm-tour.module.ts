/**
 * Created by gaurav.pandvia on 2/10/17.
 */

import { TourStepTemplateComponent } from './components/tour-step-template.component';
import { TourStepTemplateService } from './services/tour-step-template.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BmTourService} from "./services/bm-tour.service";
import {RouterModule} from "@angular/router";
import BmTourAnchorDirective from "./bm-tour-anchor.directive";
import {TourContentService} from "./services/tour-content.service";
import {TourContentComponent} from "./components/bm-tour.component";
import {InjectionRegisteryService} from "./services/injection-registry.service";
import {InjectionService} from "./services/injection.service";


@NgModule({
  declarations: [BmTourAnchorDirective, TourStepTemplateComponent,TourContentComponent],
  exports: [BmTourAnchorDirective, TourStepTemplateComponent,TourContentComponent],
  imports: [CommonModule,RouterModule],
  entryComponents: [TourContentComponent],
  providers: [TourStepTemplateService,TourContentService,InjectionService],
})
export class BmTourModule {
}

export {BmTourAnchorDirective,BmTourService};
