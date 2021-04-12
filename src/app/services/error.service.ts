import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    public classServiceError = document.querySelector('.service-error');

    constructor() {
    }

    clearMessage() {
       // return this.classServiceError.innerText = '';
    }

    setMessage(message: string) {
        // return this.classServiceError.innerText = message;
    }
}
