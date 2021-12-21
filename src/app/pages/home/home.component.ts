import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {JsPageService} from '../../services/js/js-page';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private renderer: Renderer2, private jsPageService: JsPageService) {
        this.renderer.addClass(document.body, 'bg');
    }

    ngOnInit(): void {
        this.jsPageService.home();
    }
}
