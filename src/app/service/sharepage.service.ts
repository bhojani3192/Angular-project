import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserContent } from '../consts/const';
import { Global } from '../shared/globle';
import { UserContentResponse } from '../models/share-page/UserContent.model';

@Injectable({
  providedIn: 'root'
})
export class SharepageService {

  private http = inject(HttpClient);

  getUserContent(contentID:string) : Observable <UserContentResponse>{
    return this.http.get<UserContentResponse>(`${Global.WebUrl}${UserContent.UserContent}${'?UserContentId='+contentID}`)
  }
  downloadContentWithWaterMark(contentID:string): Observable<Blob> {
    return this.http.get(`${Global.WebUrl}${UserContent.downloadContentWithWaterMark}${contentID}`, { responseType: 'blob' })
  }
}
