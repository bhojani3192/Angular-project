import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EarlyAccessRequestResponse } from '../models/landing-page/EarlyAccessRequest.model';
import { Global } from '../shared/globle';
import { EarlyAccess, TopCategoryContent, User } from '../consts/const';
import { TopCategoryContentResponse } from '../models/landing-page/TopCategoryContent.model';
@Injectable({
  providedIn: 'root'
})
export class LandingpageService {

  private http = inject(HttpClient);

  sendEarlyAccessRequest(data:EarlyAccessRequestResponse) : Observable <EarlyAccessRequestResponse>{
    return this.http.post<EarlyAccessRequestResponse>(`${Global.WebUrl}${EarlyAccess.sendEarlyAccessRequest}`,data).pipe(
      tap((res: any) => {
        return res;
      }))
  }
  getTopCategoryContents() : Observable <TopCategoryContentResponse[]>{
    return this.http.get<TopCategoryContentResponse[]>(`${Global.WebUrl}${TopCategoryContent.getDefaultTopCategoryContents}`)
  }

  generateQRLoginCode(): Observable <any>{
    return this.http.post<any>(`${Global.WebUrl}${User.generateQRLoginCode}`,{});
  }

  loginWithCode(code:any): Observable <any>{
    return this.http.post<any>(`${Global.WebUrl}${User.loginWithCode}${code}`,{})
  }
}
