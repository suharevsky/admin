import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FieldService {

    constructor() {
    }

    getHeight() {

        const values = [];

        for (let i = 150; i <= 219; i++) {
            values.push(i);
        }

        return {title: 'גובה', measure: 'ס"מ', options: values};
    }

    getBodyType() {

        const values = ['רזה', 'חטוב', 'סקסי', 'ממוצע', 'כמה ק"ג עודפים', 'מלא', 'אספר אח"כ '];

        return {title: 'מבנה גוף', options: values};
    }

    getPreference() {
        const values = ['גבר', 'אישה', 'זוג'];

        return {title: 'מבנה גוף', options: values};
    }

    getArea() {
        const values = ['חיפה והסביבה', 'אילת', 'אזור הנגב', 'גוש דן והשרון', 'ירושלים והסביבה', 'גליל והעמקים', 'רמת הגולן והסביבה'];
        return {title: 'אני מחפש/ת...', options: values};

    }

    getMaritalStatus() {
        const values = ['רזה', 'חטוב', 'סקסי', 'ממוצע', 'כמה ק"ג עודפים', 'מלא', 'אספר אח"כ'];
        return {title: 'מצב משפחתי', options: values};
    }

    getLookingFor() {
        const values = ['אהבה', 'קשר רציני', 'יחסי עבד ושליט', 'סקס און-ליין', 'סקס רגיל', 'סטיות', 'בילויים משותפים'];
        return {title: 'אני מחפש/ת', options: values};
    }

    getStatus() {
        const values = ['Deleted', 'Active', 'Pending', 'Banned', 'Frozen'];
        return {title: 'אני מחפש/ת', options: values};
    }
}
