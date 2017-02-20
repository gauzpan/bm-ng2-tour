/**
 * Created by gaurav.pandvia on 2/15/17.
 */

import {
    Input, Component, ElementRef, AfterViewInit, ViewEncapsulation,
    HostListener, ViewChild, HostBinding, Renderer
} from '@angular/core';
import {PlacementTypes} from "../utils/placements";
import {PositionHelper} from "../utils/position";



@Component({
    selector: 'bm-tour-content',

    template: `
    <div class="overlay"></div>
    <div class="bm-tour-content"  #content>
      <span
        #caretElm
        [hidden]="!showCaret"
        class="tooltip-caret position-{{this.placement}}">
      </span>
      <div class="tooltip-content">
      
          <template
            [ngTemplateOutlet]="template"
            [ngOutletContext]="{step : context }">
          </template>
       
      </div>
    </div>
  `,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./../utils/test-tour.scss']
})
export class TourContentComponent implements AfterViewInit {

    @Input() host: ElementRef;
    @Input() context : any;
    @Input() showCaret: boolean = true;
    @Input() placement: PlacementTypes;
    @Input() spacing: number;
    @Input() cssClass: string;
    @Input() title: string;
    @Input() alignment: string = "right";
    popoverClass : string = "";
    @ViewChild('caretElm') caretElm;
    @ViewChild('content') contentElm : ElementRef;

    @HostBinding('class')
    get cssClasses(): string {
        let clz = 'bm-tour-content';
        clz += ` position-${this.placement}`;
        clz += ` ${this.cssClass}`;
        this.popoverClass = clz;
        return "popover-content";
    }

    constructor(
        public element: ElementRef,
        private renderer: Renderer) {
    }

    ngAfterViewInit(): void {
        setTimeout(this.position.bind(this));
    }

    position(): void {
        // const nativeElm = this.element.nativeElement;
        const nativeElm : Element = this.contentElm.nativeElement;


        this.renderer.setElementClass(nativeElm,'position-'+this.placement,true);
        this.renderer.setElementClass(nativeElm,this.cssClass,true);
        let highlightedElems = document.querySelectorAll('.highlightOnOverlay');
        for(let i=0;i<highlightedElems.length;i++){
            highlightedElems[i].classList.remove('highlightOnOverlay');
        }
        this.renderer.setElementClass(this.host.nativeElement,'highlightOnOverlay',true);
        const hostDim = this.host.nativeElement.getBoundingClientRect();

        // if no dims were found, never show
        if(!hostDim.height && !hostDim.width) return;

        const elmDim = nativeElm.getBoundingClientRect();
        this.checkFlip(hostDim, elmDim);
        this.positionContent(nativeElm, hostDim, elmDim);

        if(this.showCaret) {
            this.positionCaret(hostDim, elmDim);
        }

        // animate its entry
        setTimeout(() => this.renderer.setElementClass(nativeElm, 'animate', true), 1);
    }

    positionContent(nativeElm, hostDim, elmDim): void {
        const { top, left } = PositionHelper.positionContent(
            this.placement, elmDim, hostDim, this.spacing, this.alignment);

        // this.renderer.setElementStyle(nativeElm, 'margin-'+this.oppositePos(this.placement), `15px`);
        this.renderer.setElementStyle(nativeElm, 'top', `${top}px`);
        this.renderer.setElementStyle(nativeElm, 'left', `${left}px`);
    }

    positionCaret(hostDim, elmDim): void {
        const caretElm = this.caretElm.nativeElement;
        const caretDimensions = caretElm.getBoundingClientRect();
        const { top, left } = PositionHelper.positionCaret(
            this.placement, elmDim, hostDim, caretDimensions, this.alignment);

        this.renderer.setElementStyle(caretElm, 'top', `${top}px`);
        this.renderer.setElementStyle(caretElm, 'left', `${left}px`);
    }

    oppositePos(placement){
        switch(placement){
            case 'top' : return 'bottom';
            case 'bottom' : return 'top';
            case 'left' : return 'right';
            case 'right': return 'left';
            default : return 'top';
        }
    }

    checkFlip(hostDim, elmDim): void {
        this.placement = PositionHelper.determinePlacement(
            this.placement, elmDim, hostDim, this.spacing, this.alignment);
    }

    // @HostListener('window:resize')
    // @throttleable(100)
    // onWindowResize(): void {
    //   this.position();
    // }

}
