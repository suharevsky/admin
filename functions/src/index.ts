import * as functions from 'firebase-functions';
import * as express from 'express';
import {
    addUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getAllUserPhotosByStatus,
    getUserByEmail,
    deleteUserPhoto,
    getUserByUsername
} from './userController';

const cors = require('cors');
const app = express();
app.use(cors()); // include before other routes
app.post('/users', addUser);
app.post('/users/login', loginUser);
app.get('/users', getAllUsers);
app.get('/users/photos:status', getAllUserPhotosByStatus);
app.get('/users/:id', getUserById);
app.get('/users/email/:email', getUserByEmail);
app.get('/users/username/:username', getUserByUsername);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.delete('/users/photos/:id', deleteUserPhoto);

exports.app = functions.https.onRequest(app);
