import {Response} from 'express';
import {db} from '../../config/firebase';

const collectionName = 'chats';

type PageType = {}

type Request = {
    body: PageType,
    params: {
        url: string;
    }
}

const getInbox = async (req: Request, res: Response) => {

    const inbox: any = [];
    const querySnapshot = await db.collection(collectionName).get();
    // querySnapshot.forEach((doc: any) => photos = doc.data());
    querySnapshot.forEach((doc: any) => inbox.push(doc.data()));

    // querySnapshot.forEach((doc: any) => page.push(doc.data()));

    return res.status(200).json(inbox);

};

export {
    getInbox
};
