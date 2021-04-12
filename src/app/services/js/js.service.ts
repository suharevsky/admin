import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsService {

    constructor() {
    }

    initHomePage() {

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

    arrowScrollDown() {

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
