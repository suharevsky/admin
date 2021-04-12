import {Response} from 'express';
import {db} from './config/firebase';

const collectionName = 'users';

type UserType = {
    id: string;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    height?: number,
    about?: string,
    area?: string,
    bodyType?: number;
    maritalStatus?: string;
    subscriptionStart?: string;
    subscriptionEnd?: string;
    preference?: [];
    photos?: [],
    lookingFor?: string[];
    gender?: string;
    status?: number; // 1 - Active | Pending | Banned | Frozen | 0 - Deleted
    birthday?: Date | string;
    birthday1?: Date | string;
    registrationDate?: string;
    ipAddress?: string;
    subscription?: boolean;
    refreshToken?: string,
    accessToken?: string,
    expiresIn?: string,
}

type Request = {
    body: UserType,
    params: {
        id: string;
    }
}

const addUser = async (req: Request, res: Response) => {
    const {id, email, password, birthday, birthday1, username, about, area, gender, preference, photos, registrationDate, ipAddress, status, lookingFor, accessToken, refreshToken, expiresIn} = req.body;
    try {
        const user = db.collection(collectionName).doc();
        const userObject = {
            id: id ? id : user.id,
            email,
            password,
            birthday,
            birthday1,
            username,
            about,
            area,
            gender,
            photos,
            ipAddress,
            status,
            accessToken,
            refreshToken,
            expiresIn,
            lookingFor,
            preference,
            registrationDate,
        };

        await user.set(userObject);

        res.status(200).send({
            status: 'success',
            message: 'user added successfully',
            data: userObject
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    let user: {} = {};

    try {
        const querySnapshot = await db.collection(collectionName)
            .where('email', '==', email)
            .where('password', '==', password).get();

        querySnapshot.forEach((doc: any) => user = doc.data());

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers: UserType[] = [];
        const querySnapshot = await db.collection(collectionName).get();
        querySnapshot.forEach((doc: any) => allUsers.push(doc.data()));
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUserByEmail = async (req: any, res: Response) => {
    try {
        //const User: UserType[] = [];
        let data: any = '';
        const querySnapshot = await db.collection(collectionName).where('email', '==', req.params.email).get();
        querySnapshot.forEach((doc: any) => data = doc.data());
        //user = querySnapshot.data(); // TRY THIS ONE !!!

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUserByUsername = async (req: any, res: Response) => {
    try {
        let data: any = '';
        const querySnapshot = await db.collection(collectionName).where('username', '==', req.params.username).get();
        querySnapshot.forEach((doc: any) => data = doc.data());

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        //const User: UserType[] = [];
        let user = '';
        const querySnapshot = await db.collection(collectionName).where('id', '==', req.params.id).get();
        querySnapshot.forEach((doc: any) => user = doc.data());
        //user = querySnapshot.data(); // TRY THIS ONE !!!
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getAllUserPhotosByStatus = async (req: Request, res: Response) => {
    try {
        //const User: UserType[] = [];
        const allPhotos: any = [];
        const querySnapshot = await db.collectionGroup('users').get();
        // querySnapshot.forEach((doc: any) => photos = doc.data());
        querySnapshot.forEach((doc: any) => allPhotos.push(doc.data().photos));

        //user = querySnapshot.data(); // TRY THIS ONE !!!

        return res.status(200).json(allPhotos);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateUser = async (req: Request, res: Response) => {
    const {
        body: {
            id, email, username, gender, about, area, bodyType, height, lookingFor, maritalStatus, password, preference, status, subscription,
            subscriptionStart, subscriptionEnd, photos
        }
    } = req;

    try {
        const user = db.collection(collectionName).doc(id);
        const currentData = (await user.get()).data() || {};
        const userObject = {
            id: id,
            username: username || currentData.username,
            photos: photos || currentData.username,
            email: email || currentData.email,
            about: about || currentData.about,
            gender: gender || currentData.gender,
            area: area || currentData.area,
            bodyType: bodyType || currentData.bodyType,
            height: height || currentData.height,
            lookingFor: lookingFor || currentData.lookingFor,
            maritalStatus: maritalStatus || currentData.maritalStatus,
            password: password || currentData.password,
            preference: preference || currentData.preference,
            status: status || currentData.status,
            subscription: subscription,
            subscriptionStart: subscriptionStart || currentData.subscriptionStart,
            subscriptionEnd: subscriptionEnd || currentData.subscriptionEnd
        };

        await user.set(userObject, {merge: true}).catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        });

        return res.status(200).json({
            status: 'success',
            message: 'user updated successfully',
            data: userObject
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const user = db.collection(collectionName).doc(id);

        await user.delete().catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        });

        return res.status(200).json({
            status: 'success',
            message: 'user deleted successfully',
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deleteUserPhoto = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const user = db.collection(collectionName).doc(id);

        await user.delete().catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        });

        return res.status(200).json({
            status: 'success',
            message: 'user deleted successfully',
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export {addUser, getUserByUsername, getAllUsers, getUserById, updateUser, deleteUser, deleteUserPhoto, loginUser, getAllUserPhotosByStatus, getUserByEmail};

