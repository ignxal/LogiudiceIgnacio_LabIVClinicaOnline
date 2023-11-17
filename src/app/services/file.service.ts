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
export class FileService {
  public listUrl: string[] = [];

  constructor(public storage: Storage) {}

  async updateImages(user: string, files: any): Promise<string[]> {
    const downloadURLs: string[] = [];

    for (let index = 0; index < files.length; index++) {
      const imgRef = ref(
        this.storage,
        'profile-pictures/' + user + '/' + new Date().getTime().toString()
      );
      const element = files[index];
      await uploadBytes(imgRef, element)
        .then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((res) => {
            downloadURLs.push(res);
          });
        })
        .catch((error) => console.log(error));
    }

    return downloadURLs;
  }

  async getProfilePictures(user: string) {
    this.listUrl = [];
    const imagesRef = ref(this.storage, 'profile-pictures/' + user);
    await listAll(imagesRef)
      .then(async (res) => {
        for (let item of res.items) {
          await getDownloadURL(item).then((res) => {
            this.listUrl.push(res);
          });
        }
      })
      .catch((error) => console.log(error));
  }
}
