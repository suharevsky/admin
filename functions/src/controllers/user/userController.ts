import {Response} from 'express';
import {admin, db} from '../../config/firebase';

const collectionName = 'users';

type UserType = {
    id: string,
    socialAuthId: string,
    username?: string,
    password?: string,
    email?: string,
    phone?: string,
    height?: number,
    about?: string,
    area?: string,
    city?: string,
    bodyType?: number,
    lastTimeActive?: number,
    maritalStatus?: string,
    subscriptionStart?: string,
    subscriptionEnd?: string,
    preference?: [],
    photos?: [],
    lookingFor?: string[],
    gender?: string,
    status?: number, // 1 - Active | Pending | Banned | Frozen | 0 - Deleted
    birthday?: Date | string,
    birthday1?: Date | string,
    registrationDate?: string,
    ipAddress?: string,
    subscription?: boolean,
    refreshToken?: string,
    accessToken?: string,
    expiresIn?: string,
    isAdmin?: boolean,
    allPhotosApproved?: number,
    mainPhotoApproved?: number,
}

type Request = {
    body: UserType | any,
    params: any
}


const getListArray = async (req: Request, res: Response) => {
    try {
        const {userId, type} = req.params;
        const listRef = db.collection(collectionName).doc(userId).collection(type).doc(userId);
        const doc = await listRef.get();

        res.status(200).send({
            status: 'success',
            data: doc.data(),
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getListData = async (req: Request, res: Response) => {
    try {
        const {myId, profileId, type} = req.params;

        let listRef:any;

        if(type === 'blockList') {
             listRef = db.collectionGroup(type)
                .where('myId', '==', profileId)
                .where('profileId', '==', myId);

        }else {
             listRef = db.collectionGroup(type)
                .where('myId', '==', myId)
                .where('profileId', '==', profileId);

        }

        const docs = await listRef.get();

        const result: any[] = [];

        docs.docs.forEach((doc:any) => {
            result.push(doc.data());
        });

        res.status(200).send({
            status: 'success',
            myId,
            profileId,
            body: getListBody(type, !docs.empty),
            result,
            empty: docs.empty

        });

    } catch (error) {
        res.status(500).json(error.message);
    }

};

const getListBody = (type: string, added: boolean) => {
    if (type === 'blockList' && added) {
        return {message: 'המשתמש הועבר לרשימה השחורה בהצלחה', label: 'הסר מהרשימה השחורה',};
    } else if (type === 'blockList' && !added) {
        return {message: 'המשתמש הוסר מהרשימה השחורה בהצלחה', label: 'הוסף לרשימה שחורה',};
    }

    if (type === 'favorites' && added) {
        return {message: 'חבר אתר נוסף לרשימת מועדפים שלך', label: 'הסר מהמועדפים',};
    } else if (type === 'favorites' && !added) {
        return {message: 'חבר האתר הוסר מרשימת המועדפים', label: 'הוסף למועדפים',};
    }
    return {message: '', label: ''};
};


const updateList = async (req: Request, res: Response) => {
    try {

        const {myId, profileId, type, accepted} = req.body;

            await db.collection(collectionName).doc(myId).collection(type).doc(profileId).set({profileId, accepted, myId, time: Date.now()}, {merge: true});

            return res.status(200).send({
                status: 'success',
                message: type + 'successfully updated',
                myId,
                profileId
            });
        

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getHighlights = async (req: Request, res: Response) => {
    
    try {
        const {request} = req.body;

        let users: any = [];
        let querySnapshot: any;
        querySnapshot = await db.collection(collectionName).limit(10).offset(5).get();
        querySnapshot.forEach((doc: any) => users.push(doc));

        return res.status(200).send({
            status: 'success',
            message: 'successfully updated',
            result: users,
            request
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
   
};

const addToList = async (req: Request, res: Response) => {

    try {

        const {myId, profileId, type, accepted} = req.body;

        let snapshot: any;

        snapshot = await db.collection(collectionName).doc(myId).collection(type).doc(profileId).get();

        if (!snapshot.data()) {
            await db.collection(collectionName).doc(myId).collection(type).doc(profileId).set({profileId, accepted, myId, time: Date.now()});

            res.status(200).send({
                status: 'success',
                data: JSON.stringify(snapshot.data()),
                body: getListBody(type, !snapshot.empty),
                message: type + 'successfully added',
                myId,
                profileId
            });
        } else {

            if (type !== 'views') {
                await db.collection(collectionName).doc(myId).collection(type).doc(profileId).delete();
            }

            res.status(200).send({
                status: 'success',
                body: getListBody(type, snapshot.empty),
                message: type + 'item',
            });
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
};


const setInboxArray = async (req: Request, res: Response) => {
    try {
        const {userId1, userId2, chatId} = req.body;

        const listObject = {
            inbox: admin.firestore.FieldValue.arrayUnion(chatId)
        };

        const user1 = db.collection(collectionName).doc(userId1).collection('inbox').doc(userId1);
        const user2 = db.collection(collectionName).doc(userId2).collection('inbox').doc(userId2);

        await user1.set(listObject, {merge: true}).catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });

        await user2.set(listObject, {merge: true}).catch(error => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });
    } catch (error) {
        res.status(500).json(error.message);
    }

};


const addUser = async (req: Request, res: Response) => {
    const {
        socialAuthId, email, password, birthday, birthday1, username, about, area, city, gender, preference, photos, registrationDate,
        ipAddress, status, lookingFor, accessToken, refreshToken, expiresIn, lastTimeActive, isAdmin, allPhotosApproved, mainPhotoApproved
    } = req.body;
    try {

        const user = socialAuthId ? db.collection(collectionName).doc(socialAuthId) : db.collection(collectionName).doc();
        const userObject = {
            id: user.id,
            uid: user.id,
            socialAuthId,
            email,
            password,
            birthday,
            birthday1,
            username,
            about,
            area,
            city,
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
            lastTimeActive,
            isAdmin,
            allPhotosApproved,
            mainPhotoApproved
        };

        await user.set(userObject);

        const counter = db.collection(collectionName).doc(userObject.id).collection('counter').doc(userObject.id);

        const counterObject = {
            views: 0,
            favorites: 0,
            newMessages: 0
        };

        await counter.set(counterObject);

        const settings = db.collection(collectionName).doc(userObject.id).collection('settings').doc(userObject.id);

        const settingsObject = {
            push: {
                views: true,
                messages: true,
                updates: true,
                active: true
            }
        };

        await settings.set(settingsObject);

        res.status(200).send({
            status: 'success',
            message: 'user added successfully',
            data: userObject
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const addUserTest = async (req: Request, res: Response) => {

    const socialAuthId = Date.now();

    const user = socialAuthId ? db.collection(collectionName).doc(String(socialAuthId)) : db.collection(collectionName).doc();

    const randomGender = ['גבר', 'זוג', 'אישה'];
    const randomName = [
        'James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Robert', 'Joseph',
        'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony',
        'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin',
        'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
        'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
        'Benjamin', 'Samuel', 'Gregory', 'Frank', 'Alexander', 'Raymond', 'Patrick', 'Jack', 'Dennis',
        'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Henry', 'Nathan', 'Douglas', 'Zachary', 'Peter', 'Kyle',
        'Walter', 'Ethan', 'Jeremy', 'Harold', 'Keith', 'Christian', 'Roger', 'Noah', 'Gerald', 'Carl', 'Terry',
        'Sean', 'Austin', 'Arthur', 'Lawrence', 'Jesse', 'Dylan', 'Bryan', 'Joe', 'Jordan', 'Billy', 'Bruce',
        'Albert', 'Willie', 'Gabriel', 'Logan', 'Alan', 'Juan', 'Wayne', 'Roy', 'Ralph', 'Randy', 'Eugene', 'Vincent',
        'Russell', 'Elijah', 'Louis', 'Bobby', 'Philip', 'Johnny'
    ];

    const username = randomName[Math.floor(Math.random() * randomName.length)];
    const gender = randomGender[Math.floor(Math.random() * randomGender.length)];


    const userObject = {
        id: user.id,
        uid: user.id,
        socialAuthId: user.id,
        email: 'aliksui.ua@gmail.com',
        password: 111111,
        birthday: '1986-08-15T18:35:44.403+03:00',
        birthday1: gender === 'זוג' ? '1986-08-15T18:35:44.403+03:00' : '',
        username: username,
        about: '....',
        area: '',
        city: 'תל אביב',
        gender: gender,
        photos: [],
        ipAddress: '127.0.0.0',
        status: 1,
        accessToken: 'access-token-0.3030861923016932',
        refreshToken: 'refreshToken-token-0.44578129937169164',
        expiresIn: '2021-11-23T15:36:06.043Z',
        lookingFor: ['סטיות'],
        preference: ['אישה'],
        registrationDate: '2021-8-15 18:36',
        lastTimeActive: Date.now(),
        isAdmin: false,
        allPhotosApproved: 1,
        mainPhotoApproved: 0
    };

    await user.set(userObject);


    const counter = db.collection(collectionName).doc(userObject.id).collection('counter').doc(userObject.id);

    const counterObject = {
        views: 0,
        favorites: 0,
        newMessages: 0
    };

    await counter.set(counterObject);

    const settings = db.collection(collectionName).doc(userObject.id).collection('settings').doc(userObject.id);

    const settingsObject = {
        push: {
            views: true,
            messages: true,
            updates: true,
            active: true
        }
    };

    await settings.set(settingsObject);


    res.status(200).send({
        status: 'success',
        message: 'user added successfully',
        data: userObject
    });
};

const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    let user: {} = {};

    try {
        const querySnapshot = await db.collection(collectionName)
            .where('email', '==', email)
            .where('isAdmin', '==', true)
            .where('password', '==', password).get();

        querySnapshot.forEach((doc: any) => user = doc.data());

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUnapprovedUsersPhotos = async (req: Request, res: Response) => {
    try {
        const allUsers: UserType[] = [];

        let querySnapshot: any;

        querySnapshot = await db.collection(collectionName).where('allPhotosApproved', '==', 0).get();

        querySnapshot.forEach((doc: any) => allUsers.push(doc.data()));
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers: UserType[] = [];

        let querySnapshot: any;

        querySnapshot = await db.collection(collectionName).get();

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

const getUserByToken = async (req: any, res: Response) => {
    try {
        //const User: UserType[] = [];
        let data: any = '';
        const querySnapshot = await db.collection(collectionName).where('accessToken', '==', req.params.token).get();
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

const getUserBySocialAuthId = async (req: Request, res: Response) => {
    try {
        //const User: UserType[] = [];
        let user = '';
        const querySnapshot = await db.collection(collectionName).where('socialAuthId', '==', req.params.id).get();
        querySnapshot.forEach((doc: any) => user = doc.data());
        //user = querySnapshot.data(); // TRY THIS ONE !!!
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getAllUserPhotosByStatus = async (req: Request, res: Response) => {
    try {

        const allPhotos: any = [];
        const querySnapshot = await db.collectionGroup('users').get();
        querySnapshot.forEach((doc: any) => allPhotos.push(doc.data().photos));

        return res.status(200).json(allPhotos);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateUser = async (req: Request, res: Response) => {
    const {
        body: {
            id, email, username, gender, about, area, city, bodyType, height, lookingFor, maritalStatus, password, preference, status, subscription,
            subscriptionStart, subscriptionEnd, photos, lastTimeActive, allPhotosApproved, mainPhotoApproved
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
            city: city || currentData.city,
            bodyType: bodyType || currentData.bodyType,
            height: height || currentData.height,
            lookingFor: lookingFor || currentData.lookingFor,
            maritalStatus: maritalStatus || currentData.maritalStatus,
            password: password || currentData.password,
            preference: preference || currentData.preference,
            status: status ? parseInt(String(status)) : currentData.status,
            subscription: subscription || currentData.subscription,
            subscriptionStart: subscriptionStart || currentData.subscriptionStart,
            subscriptionEnd: subscriptionEnd || currentData.subscriptionEnd,
            lastTimeActive: lastTimeActive || currentData.lastTimeActive,
            allPhotosApproved: allPhotosApproved === 0 || allPhotosApproved === 1 ? allPhotosApproved : currentData.allPhotosApproved,
            mainPhotoApproved: mainPhotoApproved === 0 || mainPhotoApproved === 1 ? mainPhotoApproved : currentData.mainPhotoApproved,
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


export {
    addUser,
    getUserByUsername,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getAllUserPhotosByStatus,
    getUserByEmail,
    getUserByToken,
    getUserBySocialAuthId,
    getUnapprovedUsersPhotos,
    addToList,
    updateList,
    getListData,
    getListArray,
    addUserTest,
    setInboxArray,
    getHighlights
};

