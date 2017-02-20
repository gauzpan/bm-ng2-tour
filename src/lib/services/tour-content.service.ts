/**
 * Created by gaurav.pandvia on 2/17/17.
 */


import {Injectable} from "@angular/core";
import {InjectionRegisteryService} from "../services/injection-registry.service";
import {InjectionService} from "../services/injection.service";
import {TourContentComponent} from "../components/bm-tour.component";
@Injectable()
export class TourContentService extends InjectionRegisteryService{
  type: any = TourContentComponent;

  constructor(injectionService: InjectionService) {
    super(injectionService);
  }

}
