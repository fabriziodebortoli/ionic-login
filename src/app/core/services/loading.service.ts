import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class IonLoaderService {
  constructor(public loadingController: LoadingController) {}

  show(loadingMessage = 'Loading...') {
    this.loadingController
      .create({
        message: loadingMessage,
      })
      .then((response) => {
        response.present();
      });
  }

  hide() {
    this.loadingController
      .dismiss()
      .then((response) => {
        console.log('Loader closed!', response);
      })
      .catch((err) => {
        console.log('Error occured : ', err);
      });
  }
}
