import {Injectable} from '@angular/core';
import {JsService} from './js.service';

@Injectable({
    providedIn: 'root'
})
export class JsPageService {

    constructor(
        public jsService: JsService
    ) {
    }

    public home() {
        this.jsService.playBgVideo();
        this.jsService.fadeInSections();
        this.jsService.arrowScrollDown();
        this.jsService.initModal();
    }
}
