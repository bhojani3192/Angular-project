import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { Global } from '../shared/globle';
import { SecretKey, User, authentication } from '../consts/const';
import { DOCUMENT } from '@angular/common';
import { APP_AUTH_CONST, LogoutAlertMessage } from '../consts/message';
import * as CryptoJS from 'crypto-js';
import { SignUp } from '../models/signup-page/SignUp.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private document = inject(DOCUMENT);
  private alertService = inject(AlertService);
  private http = inject(HttpClient);

  private refreshShareHeader = new Subject<void>();
  refreshShareHeaderComponent$ = this.refreshShareHeader.asObservable();

  triggerShareHeader() {
    this.refreshShareHeader.next();
  }

  private refreshSubject = new Subject<void>();  
  refresh$ = this.refreshSubject.asObservable();  

  triggerRefresh() {  
    this.refreshSubject.next();  
  }  

  login(data: any): Observable<any> {
    return this.http
      .post<any>(`${Global.WebUrl}${authentication.userlogin}`, data)
      .pipe(
        tap((res: any) => {
          return res;
        })
      );
  }

  signUp(signUp: SignUp): Observable<any> {
    return this.http
      .post<any>(`${Global.WebUrl}${authentication.userSignUp}`, signUp)
      .pipe(
        tap((res: any) => {
          return res;
        })
      );
  }

  userIsLogin(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage?.getItem(APP_AUTH_CONST)) {
      return true;
    } else {
      return false;
    }
  }

  getAuthToken(): string | undefined | null {
    try{
    const localStorage = this.document.defaultView?.localStorage;
    const encryptedData: any = localStorage?.getItem(APP_AUTH_CONST);
    let token: string | undefined;
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SecretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      token = decryptedData.token;
    }
    return token;
  }catch{
    return null;
  }
  }

  getAuthUser(): string | undefined | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem(APP_AUTH_CONST);
  }
  onUserLogout(): Observable<boolean> {
    return this.alertService.openAlert(LogoutAlertMessage).pipe(
      map((confirmationRes: boolean) => {
        if (confirmationRes) {
          const localStorage = this.document.defaultView?.localStorage!;
          localStorage.removeItem(APP_AUTH_CONST);
          return true;
        }
        return false;
      }),
      catchError((err: any) => {
        return of(false);
      })
    );
  }

  getValueFromStorage(storageKey: string): any {
    try {
      const localStorage = this.document.defaultView?.localStorage;
      const value = localStorage?.getItem(storageKey);
      return value ? this.decryptValue(value) : null;
    } catch (error) {
      return null;
    }
  }
  setValueInStorage(stroageKey: string, value: any): boolean {
    try {
      const localStorage = this.document.defaultView?.localStorage!;
      if (localStorage) {
        localStorage.setItem(stroageKey, this.encryptValue(value));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  sendotp(email:any) : Observable <any> {
    return this.http.post<any>(`${Global.WebUrl}${authentication.sendOTP}${email}`,{}).pipe(
      tap((res: any) => {
        return res;
      }))
  }
  verifyotp(data:any) : Observable <any> {
    return this.http.post<any>(`${Global.WebUrl}${authentication.verifyOTP}`,data).pipe(
      tap((res: any) => {
        return res;
      }))
  }
  submitnewpassword(data:any) : Observable <any> {
    return this.http.post<any>(`${Global.WebUrl}${authentication.resetPassword}`,data).pipe(
      tap((res: any) => {
        return res;
      }))
  }

  getUserDetail() : Observable <any>{
    return this.http.get<any>(`${Global.WebUrl}${User.User}`)
  }
  private decryptValue(value: string): any {
    const bytes = CryptoJS.AES.decrypt(value, SecretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  private encryptValue(value: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), SecretKey).toString();
  }
}
