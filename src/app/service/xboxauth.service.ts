import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XboxAuthService {
  private xboxLoginUrl = 'https://xbl.io/app/auth/ef98cc62-4aeb-eca5-5b94-aab2235b5edf';
  private apiCallbackUrl = 'https://api-devappserver.azurewebsites.net/';

  constructor() {}

  login(): Observable<any> {
    return from(this.openPopupAndWaitForCallback());
  }

  private openPopupAndWaitForCallback(): Promise<any> {
    return new Promise((resolve, reject) => {
      const width = 600;  
      const height = 600;  
      const left = window.screenX + (window.innerWidth / 2) - (width / 2);  
      const top = window.screenY + (window.innerHeight / 2) - (height / 2);  
      console.log("top : " + top)
      const popup = window.open(this.xboxLoginUrl, 'Xbox Login', `width=${width},height=${height},top=${top},left=${left}`);
      
      if (!popup) {
        reject('Popup blocked. Please allow popups for this website.');
        return;
      }

      const messageListener = (event: MessageEvent) => {
        //console.log('Received message:', event);
        if (event.origin !== new URL(this.apiCallbackUrl).origin) {
          //console.log('Origin mismatch. Expected:', new URL(this.apiCallbackUrl).origin, 'Received:', event.origin);
          return;
        }

        window.removeEventListener('message', messageListener);
        popup.close();
        resolve(event.data);
      };

      //console.log('Adding message listener');
      window.addEventListener('message', messageListener);

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', messageListener);
          reject('Login canceled');
        }
      }, 1000);

      // Add a timeout
      setTimeout(() => {
        window.removeEventListener('message', messageListener);
        popup.close();
        reject('Login timed out');
      }, 300000); // 5 minutes timeout
    });
  }
}