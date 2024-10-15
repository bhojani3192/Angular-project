import { Injectable } from '@angular/core';
import { Observable, from, switchMap, of } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  openAlert(text: string): Observable<boolean> {
    return from(
      Swal.fire({
        text: text,
        showCancelButton: true,
        confirmButtonColor: "#8630F4",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        background:'#191C1A',
        color:'#F8F8F8',
      })
    ).pipe(
      switchMap((result: any) => {
        if (result.isConfirmed) {
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }

  Alert(text:string){
    Swal.fire({
      text: text,
      confirmButtonColor: "#8C9EFF",})
  }

  CancleAlert(text:string){
    Swal.fire({
      text: text,
      showCancelButton: true,
      confirmButtonColor: "#8C9EFF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    })
  }
}
