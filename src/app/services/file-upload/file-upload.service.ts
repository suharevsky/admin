import {Injectable} from '@angular/core';
import {finalize, map} from 'rxjs/operators';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {UserService} from '../../modules/user-management/_services';
import {User} from '../../modules/user-management/_models/user.model';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    uploadProgress;
    uploadState: Observable<string>;
    user: User;
    downloadURL;
    public dimensions: any = {s: '120x120', m: '200x200', l: '600x600'};

    constructor(
        private afStorage: AngularFireStorage,
        private userService: UserService,
    ) {
    }

    public uploadFile(event) {
        /* // create a random id
         const randomId = Math.random().toString(36).substring(2);
         // create a reference to the storage bucket location
         this.ref = this.afStorage.ref('/images/' + randomId);
         // the put method creates an AngularFireUploadTask
         // and kicks off the upload
         this.task = this.ref.put(event.target.files[0]);

         // AngularFireUploadTask provides observable
         // to get uploadProgress value
         this.uploadProgress = this.task.snapshotChanges()
             .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

         // observe upload progress
         this.uploadProgress = this.task.percentageChanges();
         // get notified when the download URL is available
         this.task.snapshotChanges().pipe(
             finalize(() => {
               this.userService.getItemById(this.user.id).subscribe((user) => {
                 console.log(2131);

                 const photos = user.photos;
                 const mainPhoto = photos.filter(photo => photo.main === true);
                 photos.push({approved: false, main: mainPhoto.length !== 1, url: randomId});

                 // save photo src to database
                 const photo = {
                   id: this.user.id,
                   photos
                 };
                 this.userService.update(photo).subscribe();
               });
               this.downloadURL = this.ref.getDownloadURL();
             })
         ).subscribe();
         this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));*/
    }




    public getBaseUrl(fileName, dimensions = 's') {

        if (fileName && fileName.includes('default.jpg')) {
            return fileName;
        }

        fileName += '_';

        if (dimensions === 's') {
            fileName = fileName + this.dimensions[dimensions];
        }

        if (dimensions === 'm') {
            fileName = fileName + this.dimensions[dimensions];
        }

        if (dimensions === 'l') {
            fileName = fileName + this.dimensions[dimensions];
        }

        return 'https://firebasestorage.googleapis.com/v0/b/joyme-19532.appspot.com/o/images%2F' + fileName + '?alt=media';
    }

    getImageDimensions(): object {
        return this.dimensions;
    }
}
