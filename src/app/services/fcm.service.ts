import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  data: any;

  constructor(
    public http: HttpClient
  ) { }

   sendPushMessage(data) {
        /*try {
            this.data = data;

            console.log(data);

            this.db.collection('push', ref => ref
                .where('user_id', '==', data.receiver?.id ? data.receiver.id : data.receiver_id))
                .snapshotChanges().pipe(take(1)).subscribe(changes => {

                changes.map((a: any) => {
                    const id = a.payload.doc?.id;

                        console.log('tiken: ' + a.payload.doc.data().token);
                        this.exec(a.payload.doc.data().token);
                        this.db.collection('push').doc(id).set({
                            lastTimeUse: Date.now()
                        },{merge: true});
                });
            });
        } catch (e) {
            console.error(e.message)
        }*/
    }

  public exec(token) {
    const newBody = {
        notification: {
            title: this.data.title,
            body: this.data.body,
            sound: 'default',
            icon: 'fcm_push_icon'
        },
        data: {
            page: '',
            receiver: this.data.receiver || '',
            sender: this.data.sender || '',
            modal: this.data.modal || false
        },
        to: token,
        message_id: 111,
        // tslint:disable-next-line:max-line-length
        // to: 'fQZM3BqTS52qtsQPRPSvVk:APA91bFnI_2cQ5V9rhRPt2ZKEwKp7LEtuY18eNajfMAJOsecpXDzBdVtW0H07yNQEgLDCDyGZk98D4c176b28x6-uNub29tGFQJM63MRgfjbFt9NdCA-1F9EY8iRYDi_xmgtin7yMH69',
        priority: 'high',
        restricted_package_name: '',
        time_to_live: 600
    };

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'key=AAAAvmQRgho:APA91bGPZFxwrmOMr2SYMfJn4AtSJLdbwrRQLUGTWSJ75oM9DpPfEJVps2isQ86RZ1GTP3yhieVAelkogSf08W3qODWs1gEUOmtLLiAESn-vsJq7m_FW6CctrW9sOLdTlFMseplxEpQ3'
        })
    };

    this.http.post('https://fcm.googleapis.com/fcm/send', newBody, httpOptions).subscribe(res => console.log(res),err => console.error(err));
}
}
