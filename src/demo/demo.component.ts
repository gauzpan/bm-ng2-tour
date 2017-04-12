import { Component } from '@angular/core';
import {BmTourService} from "../lib/services/bm-tour.service";

@Component({
  selector: 'tour-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  constructor(public tourService: BmTourService) {
    this.tourService.initialize([{
      anchorId: 'start.tour',
      content: 'Welcome to the Bm-Ng2-Tour tour!',
      placement: 'below',
      showNext : true,
      showPrev : true,
      showCursor: true,
      alignment :'right',
      title: 'Welcome',
    }, {
      anchorId: 'angular-ui-tour',
      content: 'Thanks to angular-ui-tour for the inspiration for the library and isaacplman for its angular 2 version',
      route: '',
      showNext : true,
      showPrev : true,
      title: 'angular-ui-tour',
    }, {
      anchorId: 'installation',
      showNext : true,
      showPrev : true,
      content: 'First, install the library...',
      title: 'Installation',
    }, {
      anchorId: 'usage',
      showNext : true,
      showPrev : true,
      content: '...then use it.',
      title: 'Usage',
    }, {
      anchorId: 'tourService.start',
      showNext : true,
      showPrev : true,
      content: 'Don\'t forget to actual start the tour.',
      title: 'Start the tour',
    }, {
      anchorId: 'config.anchorId',
      showNext : true,
      showPrev : true,
      content: 'Every step needs an anchor.',
      title: 'Anchor',
    }, {
      anchorId: 'config.route',
      showNext : true,
      showPrev : true,
      content: 'Tours can span multiple routes.',
      route: '',
      title: 'Route',
    }, {
      anchorId: 'another.route',
      showNext : true,
      showPrev : true,
      content: 'Like this!',
      route: 'other',
      title: 'Another Route',
    }, {
      anchorId: 'config.route',
      content: 'And then back again.',
      placement: 'below',
      route: '',
      title: 'Route Return',
    }, {
      anchorId: 'config.placement.default',
      content: 'Steps can be positioned around an anchor. You can even have multiple steps use the same anchor.',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Slide to the left.',
      placement: 'left',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Sliiide to the right.',
      placement: 'right',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Take it back now y\'all.  One hop this time.',
      placement: 'below',
      title: 'Placement',
    }, {
      anchorId: 'hotkeys',
      content: 'Try using the hotkeys to navigate through the tour.',
      title: 'Hotkeys',
    }, {
      anchorId: 'events',
      content: 'You can subscribe to events',
      title: 'Events',
    }],{
      showCaret : true
    });
    this.tourService.start();
  }
}
