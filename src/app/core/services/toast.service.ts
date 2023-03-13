import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

const TOAST_DEFAULT = {
  duration: 5000
}

@Injectable({
  providedIn: 'root',
})
export class IonToastService {
  constructor(private toastController: ToastController) {}

  async info(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: TOAST_DEFAULT.duration
    });

    await toast.present();
  }
}
