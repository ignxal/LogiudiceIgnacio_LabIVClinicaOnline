import { Injectable } from '@angular/core';
import {
  ref,
  Storage,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(public storage: Storage) {}

  async updateImages(user: string, files: any) {
    const downloadURLs: string[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const imgRef = ref(
        this.storage,
        'profile-pictures/' + user + '/' + new Date().getTime().toString()
      );

      try {
        const uploadTask = await uploadBytes(imgRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        downloadURLs.push(downloadURL);
      } catch (error) {
        console.log(error);
      }
    }

    return downloadURLs;
  }
}
