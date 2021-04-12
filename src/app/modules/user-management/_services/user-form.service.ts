import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserFormService {

    public fields = {
        preference: {
            options: {}
        },
        area: {
            options: [
                {title: 'רמת הגולן והסביבה'},
                {title: 'גליל והעמקים'},
                {title: 'חיפה והסביבה'},
                {title: 'גוש דן והשרון'},
                {title: 'ירושלים והסביבה'},
                {title: 'אזור הנגב'},
                {title: 'אילת'},
            ],
        },
        lookingFor: {
            options: [
                {title: 'אהבה'},
                {title: 'סקס רגיל'},
                {title: 'סטיות'},
                {title: 'קשר רציני'},
                {title: 'סקס און-ליין'},
                {title: 'בילויים משותפים'},
                {title: 'יחסי עבד ושליט'},
            ],
        },

        height: {
            options: [
                {min: 151},
                {max: 119},
            ],
        },

        maritalStatus: {
            options: [
                {title: 'רווק/ה'},
                {title: 'נשוי/ה'},
                {title: 'גרוש/ה'},
                {title: 'אלמן/ה'},
                {title: 'אספר אח"כ'},
            ],
        },

        weight: {
            options: [
                {min: 151},
                {max: 119},
            ],
        }
    };

    constructor() {
    }
}
