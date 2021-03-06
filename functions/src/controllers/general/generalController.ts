import {Response} from 'express';
//@ts-ignore;
const Vonage = require('@vonage/server-sdk')

const sendAppLink = async (req: any, res: Response) => {

    try {
        const {phoneNumber} = req.body;
        //@ts-ignore;
        const vonage = new Vonage({
            apiKey: "5bc6b102",
            apiSecret: "ejXaTtiij1eV9TQw"
        });

        let message = '';

        let response: any;
        
        const from = 'Joyme';
        const to = phoneNumber;
        const text = "קישור לאפליקציה \nhttps://joyme.co.il";
        const opts = {
            "type": "unicode"
          }

        vonage.message.sendSms(from, to, text, opts, (err:any, responseData:any) => {

            response = responseData;
            if (err) {
                message = err;
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    message = "Message sent successfully.";
                } else {
                    message = `Message failed with error: ${responseData.messages[0]['error-text']}`;
                }
            }
        });
       
        return res.status(200).json({
            status: 'success test',
            message,
            response: JSON.stringify(response),
            req: phoneNumber
        });

    }catch (error) {
        return res.status(500).json(error.message);
    }
};

export {
    sendAppLink
};
