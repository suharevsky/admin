import * as functions from 'firebase-functions';
import * as express from 'express';
import {
    addToList,
    updateList,
    addUser,
    addUserTest,
    deleteUser,
    getAllUserPhotosByStatus,
    getAllUsers,
    getListArray,
    getListData,
    getUnapprovedUsersPhotos,
    getUserByEmail,
    getUserById,
    getUserBySocialAuthId,
    getUserByToken,
    getUserByUsername,
    loginUser,
    setInboxArray,
    updateUser,
    getHighlights
} from './controllers/user/userController';

import { sendAppLink } from './controllers/general/generalController';

import {deleteReportItems, getReportAbuseList} from './reportAbuseController';

import {addLike, getReceiverLikes} from './LikeController';
import {getPage} from './controllers/page/pageController';
import {getInbox} from './controllers/messages/inboxController';
import {getMessagesById, send, getDialogue, setDialogue} from './controllers/messages/messagesController';
import {getAdminSettings, updateSettings} from './controllers/adminSettings/adminSettingsController';


const cors = require('cors');
const app = express();
app.use(cors()); // include before other routes

/** Admin Settings **/
app.get('/adminSettings', getAdminSettings);
app.put('/adminSettings/:id', updateSettings);

/** User **/
app.post('/users', addUser);
app.post('/users/login', loginUser);
app.get('/users', getAllUsers);
app.get('/users/photos/unapproved', getUnapprovedUsersPhotos);
app.get('/users/photos:status', getAllUserPhotosByStatus);
app.get('/users/:id', getUserById);
app.get('/users/socialAuthId/:id', getUserBySocialAuthId);
app.get('/users/email/:email', getUserByEmail);
app.get('/users/token/:token', getUserByToken);
app.get('/users/username/:username', getUserByUsername);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

/** Likes **/
app.get('/likes/:receiver_id', getReceiverLikes);
app.post('/likes', addLike);

/** Highlights **/
app.get('/users/highlights', getHighlights);

/** Page **/
app.get('/page/:url', getPage);

/** Report Abuse **/
app.get('/report-abuse', getReportAbuseList);
app.put('/report-abuse/deleteItems', deleteReportItems);

/** Inbox **/
//app.get('/inbox', getInbox);

app.post('/users/inboxArray', setInboxArray);

/** Blocked Favorite, Blacklist **/
app.post('/users/list', addToList);
app.post('/users/list/update', updateList);
app.get('/users/list/:type/:myId/:profileId', getListData);
app.get('/users/array/list/:type/:userId', getListArray);

/** Messages **/
app.get('/messages/:id', getMessagesById);
app.get('/messages/dialogue/:interlocutorId/:currentUserId', getDialogue);
app.post('/messages/dialogue', setDialogue);
app.post('/messages/send', send);

/** TESTS **/
app.post('/test/users', addUserTest);

app.post('/general/sendAppLink',sendAppLink)


exports.app = functions.https.onRequest(app);
