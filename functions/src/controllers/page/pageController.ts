import {Response} from 'express';
import {db} from '../../config/firebase';

type PageType = {}

type Request = {
    body: PageType,
    params: {
        url: string;
    }
}

const getPage = async (req: Request, res: Response) => {

    const pages: any = [];
    const querySnapshot = await db.collection('pages').where('url', '==', req.params.url).get();
    querySnapshot.forEach((doc: any) => pages.push(doc.data()));
    return res.status(200).json(pages);
};

export {
    getPage
};
