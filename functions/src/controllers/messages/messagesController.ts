import {Response} from 'express';
import {admin, db} from '../../config/firebase';

const collectionName = 'chats';

type Request = {
    body: any,
    params: any
}

const getMessagesById = async (req: Request, res: Response) => {

    const chat = db.collection(collectionName).doc(req.params.id).get().then((doc: any) => doc.data());

    return res.status(200).json(chat);
};

const send = async (req: Request, res: Response) => {
    try {
        const {chatId, adminExists, message, uid1, uid2} = req.body;

        const ref = await db.collection('chats').doc(chatId).get();

        if (ref.exists) {

            const chat = await db.collection('chats').doc(chatId);

            await chat.update({
                messages: admin.firestore.FieldValue.arrayUnion(message),
                lastModified: Date.now(),
                adminExists,
            });

            return res.status(200).json({status: 'success', message: 'chat successfully updated'});

        } else {
            const chat = await db.collection('chats').doc(chatId);

            await chat.set({
                messages: [message],
                lastModified: Date.now(),
                adminExists,
                uid1,
                uid2,
            });

            return res.status(200).json({status: 'success', message: 'chat successfully created'});
        }

    } catch (error) {
        return res.status(500).json(error.message);
    }

};


const setDialogue = async (req: Request, res: Response) => {

    const {interlocutorId, currentUserId, chatId} = req.body;

    await db.collection('users').doc(currentUserId)
        .collection('inbox')
        .doc(interlocutorId)
        .set({id: chatId}).catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        });

    await db.collection('users').doc(interlocutorId)
        .collection('inbox')
        .doc(currentUserId)
        .set({id: chatId}).catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        });

    return res.status(200).json({
        // @ts-ignore
        chat: {status: 'success', message: 'dialogue created'}
    });

};

const getDialogue = async (req: Request, res: Response) => {
    try {
        const {interlocutorId, currentUserId} = req.params;

        let chatId = currentUserId + interlocutorId;

        const result = await db.collection('users').doc(currentUserId)
            .collection('inbox')
            .doc(interlocutorId)
            .get();


        if (!result.exists) {
            chatId = currentUserId + interlocutorId;
        }

        // @ts-ignore
        const id = result.exists ? result.data().id : chatId;

        return res.status(200).json({
            // @ts-ignore
            chat: {id, exists: result.exists}
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export {
    getMessagesById,
    getDialogue,
    setDialogue,
    send
};
