import {Response} from 'express';
import {db} from '../../config/firebase';

const collectionName = 'adminSettings';


type Request = {
    body: any,
    params: {
        url: string;
    }
}

const getAdminSettings = async (req: Request, res: Response) => {
    const adminSettings: any = [];
    const querySnapshot = await db.collection(collectionName).get();
    querySnapshot.forEach((doc: any) => adminSettings.push({id: doc.id, ...doc.data()}));
    return res.status(200).json(adminSettings);
};

const updateSettings = async (req: Request, res: Response) => {
    const {
        body: {id, onlineDuration}
    } = req;

    const adminSettings = db.collection(collectionName).doc(id);
    const currentData = (await adminSettings.get()).data() || {};

    const userObject = {
        settings: {
            id: id,
            onlineDuration: onlineDuration || currentData.onlineDuration,
        }
    };

    await adminSettings.set(userObject, {merge: true}).catch(error => {
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    });

    return res.status(200).json({
        status: 'success',
        message: 'admin settings updated successfully',
        data: userObject
    });

};

export {
    getAdminSettings,
    updateSettings
};
