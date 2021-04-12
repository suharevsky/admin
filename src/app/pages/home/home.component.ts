import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

    constructor(private renderer: Renderer2) {
        this.renderer.addClass(document.body, 'bg');
    }

    ngAfterViewInit(): void {

        document.querySelector('.scroll-down').addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('#section--1').scrollIntoView({behavior: 'smooth'});
        });


        // Contact Form

        const btnCloseModal = document.querySelector('.btn--close-modal');
        const modal = document.querySelector('.modal--popup');
        const overlay = document.querySelector('.overlay');

        const closeModal = () => {
            modal.classList.add('hidden');
            overlay.classList.add('hidden');
        };

        // Modal Popup
        const openModal = () => {
            modal.classList.remove('hidden');
            overlay.classList.remove('hidden');
        };

        const btnsOpenContact = document.querySelectorAll('.btn--show-contact');
        btnsOpenContact.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        overlay.addEventListener('click', closeModal);
        btnCloseModal.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    ngOnInit(): void {
    }
}
