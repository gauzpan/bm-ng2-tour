/**
 * Created by gaurav.pandvia on 2/10/17.
 */

import {Injectable} from "@angular/core";
import {UrlSegment, Router} from "@angular/router";
import {Subject, Observable} from "rxjs/Rx";
import { mergeStatic } from 'rxjs/operator/merge';
import { map } from 'rxjs/operator/map';
import * as _ from 'lodash';
import BmTourAnchorDirective from "../bm-tour-anchor.directive";


export interface IStepOption {
  stepId?: string;
  spacing ?: number;
  anchorId?: string;
  nextStepCallback?: any;
  callbackRef?: any;
  title?: string;
  content?: string;
  route?: string | UrlSegment[];
  showPrev?: boolean;
  showNext?: boolean;
  showCursor?: boolean;
  showFinish?: boolean;
  nextStep?: number | string;
  prevStep?: number | string;
  placement?: 'above' | 'below' | 'after' | 'before' | 'left' | 'right';
  preventScrolling?: boolean;
  alignment?: string;
  showCaret?: boolean;
}

export enum TourState {
  OFF,
  ON,
  PAUSED,
}

@Injectable()
export class BmTourService{
  public stepShow$: Subject<IStepOption> = new Subject<IStepOption>();
  public stepHide$: Subject<IStepOption> = new Subject<IStepOption>();
  public initialize$: Subject<IStepOption[]> = new Subject<IStepOption[]>();
  public start$: Subject<IStepOption> = new Subject<IStepOption>();
  public end$: Subject<any> = new Subject<any>();
  public pause$: Subject<IStepOption> = new Subject<IStepOption>();
  public resume$: Subject<IStepOption> = new Subject<IStepOption>();
  public anchorRegister$: Subject<string> = new Subject<string>();
  public anchorUnregister$: Subject<string> = new Subject<string>();
  //Flatten Observables
  public events$: Observable<{ name: string, value: any }> = mergeStatic<{ name: string, value: any }>(
    map.bind(this.stepShow$)(value => ({ name: 'stepShow', value })),
    map.bind(this.stepHide$)(value => ({ name: 'stepHide', value })),
    map.bind(this.initialize$)(value => ({ name: 'initialize', value })),
    map.bind(this.start$)(value => ({ name: 'start', value })),
    map.bind(this.end$)(value => ({ name: 'end', value })),
    map.bind(this.pause$)(value => ({ name: 'pause', value })),
    map.bind(this.resume$)(value => ({ name: 'resume', value })),
    map.bind(this.anchorRegister$)(value => ({ name: 'anchorRegister', value })),
    map.bind(this.anchorUnregister$)(value => ({ name: 'anchorUnregister', value })),
  );

  public steps: IStepOption[];
  public currentStep: IStepOption;

  public anchors: { [anchorId: string]: BmTourAnchorDirective } = {};
  public status: TourState = TourState.OFF;

  //Anchors place

  constructor(private router: Router) { }

  public initialize(steps: IStepOption[], stepDefaults?: IStepOption): void {
    if (steps && steps.length > 0) {
      this.steps = steps.map(step => Object.assign({}, stepDefaults, step));
      this.initialize$.next(steps);
      this.status = TourState.OFF;
    }
  }

  public start(): void {
    this.startAt(0);
  }

  public startAt(stepId: number | string): void {
    this.goToStep(this.loadStep(stepId));
    this.status = TourState.ON;
    this.start$.next();
    // this.setHotkeys();
  }

  public end(): void {
    this.hideStep(this.currentStep);
    this.currentStep = undefined;
    this.status = TourState.OFF;
    let highlightedElems = document.querySelectorAll('.highlightOnOverlay');
    for(let i=0;i<highlightedElems.length;i++){
      highlightedElems[i].classList.remove('highlightOnOverlay');
      highlightedElems[i].classList.remove('showCursorPointer');
    }
    this.end$.next();
    // this.removeHotkeys();
  }

  public pause(): void {
    this.hideStep(this.currentStep);
    this.pause$.next();
    this.status = TourState.PAUSED;
    // this.setHotkeys();
  }

  public resume(): void {
    this.showStep(this.currentStep);
    this.resume$.next();
    this.status = TourState.ON;
    // this.removeHotkeys();
  }

  public toggle(pause?: boolean): void {
    if (pause) {
      if (this.currentStep) {
        this.pause();
      } else {
        this.resume();
      }
    } else {
      if (this.currentStep) {
        this.end();
      } else {
        this.start();
      }
    }
  }

  public next(): void {
    this.goToStep(this.loadStep(this.currentStep.nextStep || this.steps.indexOf(this.currentStep) + 1));
  }

  public hasNext(step: IStepOption): boolean {
    return step.nextStep !== undefined || this.steps.indexOf(step) < this.steps.length - 1;
  }

  public prev(): void {
    this.goToStep(this.loadStep(this.currentStep.prevStep || this.steps.indexOf(this.currentStep) - 1));
  }

  public hasPrev(step: IStepOption): boolean {
    return step.prevStep !== undefined || this.steps.indexOf(step) > 0;
  }

  public goto(stepId: number | string): void {
    this.goToStep(this.loadStep(stepId));
  }

  public register(anchorId: string, anchor: any): void {
    if (this.anchors[anchorId]) {
      return;
    }
    this.anchors[anchorId] = anchor;
    this.anchorRegister$.next(anchorId);
  }

  public unregister(anchorId: string): void {
    delete this.anchors[anchorId];
    this.currentStep = undefined;
    this.anchorUnregister$.next(anchorId);
  }

  /**
   * Configures hot keys for controlling the tour with the keyboard
   */
  // private setHotkeys(): void {
  //   this.hotkeyService.add(this.hotkeys);
  // }
  //
  // private removeHotkeys(): void {
  //   this.hotkeyService.remove(this.hotkeys);
  // }

  private goToStep(step: IStepOption): void {
    if (!step) {
      this.end();
      return;
    }
    if(this.currentStep && this.currentStep.nextStepCallback){
      this.currentStep.nextStepCallback.call(this.currentStep.callbackRef);
    }
    let navigatePromise: Promise<boolean> = new Promise(resolve => resolve(true));
    if (step.route !== undefined && typeof (step.route) === 'string') {
      navigatePromise = this.router.navigateByUrl(<any>step.route);
    } else if (step.route && Array.isArray(step.route)) {
      navigatePromise = this.router.navigate(<any>step.route);
    }

    navigatePromise.then(navigated => {
      if (navigated !== false) {
        this.setCurrentStep(step);
      }
    });
  }

  private loadStep(stepId: number | string): IStepOption {
    if (typeof (stepId) === 'number') {
      return this.steps[stepId];
    } else {
      // return _.find(this.steps,{stepId : stepId});
      return this.steps.find(step => step.stepId === stepId);
    }
  }

  private setCurrentStep(step: IStepOption): void {
    if (this.currentStep) {
      this.hideStep(this.currentStep);
    }
    this.currentStep = step;
    this.showStep(this.currentStep);
  }

  public showStep(step: IStepOption): void {
    const anchor = this.anchors[step.anchorId];
    if (!anchor) {
      this.end();
      return;
    }
    if(this.status != 0) {
      anchor.showTourStep(step);
    }else{
      return;
    }
    // this.stepShow$.next(step);
  }

  public hideStep(step: IStepOption): void {
    const anchor = this.anchors[step.anchorId];
    if (!anchor) {
      return;
    }
    anchor.hideTourStep();
    this.stepHide$.next(step);
  }

}
