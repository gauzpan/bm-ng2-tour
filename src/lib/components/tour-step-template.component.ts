
import { Component, TemplateRef, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import {BmTourService} from "../services/bm-tour.service";
import {TourStepTemplateService} from "../services/tour-step-template.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tour-step-template',
  styles: ['body { max-height: 100vh; }'],
  template: `
     <template #tourStep let-step="step">
     <span class="close-tour" (click)="tourService.end()"></span>
     <p class="title"> {{step?.title}}</p>
      <p class="tour-step-content " [innerHTML]="step.content"></p>
      <div class="tour-step-navigation">
        <button *ngIf="step.showPrev && tourService.hasPrev(step)" class="btn btn-sm btn-default" (click)="tourService.prev()">« Prev</button>
        <button *ngIf="step.showNext && tourService.hasNext(step)" class="btn-color btn btn-sm btn-default" (click)="tourService.next()">Next »</button>
        <button *ngIf="step.showFinish" class="btn-color btn btn-sm" (click)="tourService.end()">Finish Tour</button>
      </div>
    </template>
  `,
})
export class TourStepTemplateComponent implements AfterViewInit {
  @ViewChild('tourStep', { read: TemplateRef }) public tourStepTemplate: TemplateRef<any>;
step : any;
  constructor(public tourStepTemplateService : TourStepTemplateService,public tourService : BmTourService) {}

  public ngAfterViewInit(): void {
    this.tourStepTemplateService.template = this.tourStepTemplate;
  }
}
