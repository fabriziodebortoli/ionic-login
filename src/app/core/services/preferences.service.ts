import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class IonPreferencesService {
  setPreference = async (key: string, value: string) => {
    await Preferences.set({
      key,
      value,
    });
  };

  removePreference = async (key: string) => {
    await Preferences.remove({ key });
  };
}
