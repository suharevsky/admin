import {Response} from 'express';
import {db} from './config/firebase';

const collectionName = 'likes';

type LikeType = {
    id: string;
    liked_id: string,
    new: boolean,
    checked: boolean
    receiver_id: string,
}

type Request = {
    body: LikeType,
    params: {
        id: string;
    }
}

const addLike = async (req: Request, res: Response) => {
    const { liked_id, checked, receiver_id } = req.body;
    try {
        const like = db.collection(collectionName).doc();
        const likeObject = {
            id: like.id,
            liked_id,
            checked,
            receiver_id,
        };

        await like.set(likeObject);

        res.status(200).send({
            status: 'success',
            message: 'user added successfully',
            data: likeObject
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getReceiverLikes = async (req: Request, res: Response) => {
    const {receiver_id} = req.body;
    let likes: {} = {};

    try {
        const querySnapshot = await db.collection(collectionName)
            .where('receiver_id', '==', receiver_id).get();

        querySnapshot.forEach((doc: any) => likes = doc.data());

        return res.status(200).json(likes);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export {
    getReceiverLikes,
    addLike
};