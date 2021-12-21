import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsService {

    public modal;
    public overlay;

    constructor() {
    }

    fadeInSections() {
        // Reveal sections
        const allSections = document.querySelectorAll('.section');

        const revealSection = (entries, observer) => {
            const [entry] = entries;

            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.remove('section--hidden');
            observer.unobserve(entry.target);
        };

        const sectionObserver = new IntersectionObserver(revealSection, {
            root: null,
            threshold: 0.15,
        });

        allSections.forEach((section) => {
            section.classList.add('section--hidden');
            sectionObserver.observe(section);
        });
    }

    playBgVideo() {
        setTimeout(_ => {
            const element: HTMLElement = document.querySelector('.play-video');
            element.click();
        }, 3000);
    }

    initModal() {
        const btnCloseModal = document.querySelector('.btn--close-modal');
        this.modal = document.querySelector('.modal--popup');
        const overlay = document.querySelector('.overlay');

        const closeModal = () => {
            this.modal.classList.add('hidden');
            this.overlay.classList.add('hidden');
        };

        const btnsOpenContact = document.querySelectorAll('.btn--show-contact');
        btnsOpenContact.forEach(btn => {
            btn.addEventListener('click', this.openModal);
        });

        overlay.addEventListener('click', closeModal);
        btnCloseModal.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.overlay.classList.remove('hidden');
    }

    arrowScrollDown() {
        document.querySelector('.scroll-down').addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('#section--1').scrollIntoView({behavior: 'smooth'});
        });
    }

    stickyNavigation() {
        const nav = document.querySelector('.main-menu');

        const header = document.querySelector('.header-container');

        const navHeight = nav.getBoundingClientRect().height;

        const stickyNav = (entries) => {
            const [entry] = entries;
            if (!entry.isIntersecting) {
                nav.classList.add('sticky');
            } else {
                nav.classList.remove('sticky');
            }
        };

        const headerObserver = new IntersectionObserver(stickyNav, {
            root: null,
            threshold: 0,
            rootMargin: `-${navHeight}px`,
        });

        headerObserver.observe(header);
    }
}
