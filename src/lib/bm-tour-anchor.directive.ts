/**
 * Created by gaurav.pandvia on 2/10/17.
 */
import { TourStepTemplateService } from './services/tour-step-template.service';

import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  Input,
  NgZone,
  Renderer,
  ViewContainerRef, OnInit, OnDestroy, TemplateRef, EventEmitter, Output,
} from '@angular/core';
import {BmTourService, IStepOption} from "./services/bm-tour.service";
import {TourContentService} from "./services/tour-content.service";

const scrollIntoViewIfNeeded = require('scroll-into-view-if-needed');

@Directive({
  selector: '[bmTourAnchor]',
})
export default class BmTourAnchorDirective implements OnInit,OnDestroy {
  @Input() bmTourAnchor: string;

  stepContext : any;
  popoverTemplate : TemplateRef<any>
  popoverTitle : any;
  container : any;
  placement: any = "top";
  alignment: any = "left";
  spacing: number = 5;
  showCaret: boolean = true;

  private component: any;
  private timeout: any;
  // private mouseLeaveContentEvent: any;
  // private mouseEnterContentEvent: any;
  // private documentClickEvent: any;

  @Output() show = new EventEmitter();
  @Output() hide = new EventEmitter();


  private element: ElementRef;

  constructor(
    private tourService: BmTourService, private tourStepTemplate: TourStepTemplateService, _elementRef: ElementRef,
    public viewContainerRef: ViewContainerRef,public ngZone : NgZone, private tourContentService: TourContentService

  ) {
    // this.ngP =  new NgbPopover(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, ngZone);

    this.element = _elementRef;
  }

  public ngOnInit(): void {
    this.tourService.register(this.bmTourAnchor, this);
  }


  public showTourStep(step: IStepOption): void {
    console.log(step);
    this.stepContext = step;
    this.popoverTemplate = this.tourStepTemplate.template;
    if(step.title)
      this.popoverTitle = step.title;
    if(step.alignment)
      this.alignment = step.alignment;
    if(step.showCaret)
      this.showCaret = step.showCaret;
    if(step.spacing)
      this.spacing = step.spacing;
    this.container = 'body';
    switch (step.placement) {
      case 'above':
        this.placement = 'top';
        break;
      case 'below':
        this.placement = 'bottom';
        break;
      case 'right':
      case 'after':
        this.placement = 'right';
        break;
      case 'left':
      case 'before':
        this.placement = 'left';
        break;
      default:
        this.placement = 'top';
    }
    let bindingOptions = this.createBoundOptions();
    this.openTourStep();
    if (!step.preventScrolling) {
      scrollIntoViewIfNeeded(this.element.nativeElement, true);
    }
  }

  public hideTourStep(): void {
    if(!this.component) return;

    const destroyFn = () => {
      // remove events
      // if(this.mouseLeaveContentEvent) this.mouseLeaveContentEvent();
      // if(this.mouseEnterContentEvent) this.mouseEnterContentEvent();
      // if(this.documentClickEvent) this.documentClickEvent();

      // emit events
      this.hide.emit(true);

      // destroy component
      this.tourContentService.destroy(this.component);
      this.component = undefined;
    };

    clearTimeout(this.timeout);
    // if(!immediate) {
    //   this.timeout = setTimeout(destroyFn, this.tooltipHideTimeout);
    // } else {
      destroyFn();
    // }
  }

  private createBoundOptions(): any {
    return {
      title: this.popoverTitle,
      template: this.popoverTemplate,
      viewContainerRef : this.viewContainerRef,
      host: this.viewContainerRef.element,
      placement: this.placement,
      alignment: this.alignment,
      showCaret: this.showCaret,
      cssClass: "myClass",
      spacing: this.spacing,
      context: this.stepContext
    };
  }

  openTourStep(){
    // if (this.component || this.tooltipDisabled) return;
    let immediate = true;
    // const time = immediate ? 0 : this.stepContext.popoverShowTimeout;
    const time = 0;
    // ngUpgrade bug
    // https://github.com/angular/angular/issues/12318
    this.ngZone.run(() => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.tourContentService.destroyAll();

        const options = this.createBoundOptions();
        this.component = this.tourContentService.create(options);

        // add a tiny timeout to avoid event re-triggers
        // setTimeout(() => {
        //   this.addHideListeners(this.component.instance.element.nativeElement);
        // }, 10);

        this.show.emit(true);
      }, time);
    });
  }

  ngOnDestroy(): void {
    this.tourService.unregister(this.bmTourAnchor);
    this.hideTourStep();
  }

}
