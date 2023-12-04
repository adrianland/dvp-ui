import { Token } from '../models/token';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../services/authApi/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private toast: NgToastService, private router: Router,private ngxService: NgxUiLoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    this.ngxService.start()
    // this.start.load();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}`} 
      })
    }


    return next.handle(request).pipe(
      tap(() => console.log('Action performed before any other')),
      catchError((err : any) => {  if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          return throwError(()=>{
            this.toast.warning({detail:"Warning", summary:"Token is expired, Please Login again"});
            this.router.navigate(['login'])
          })
        }
      }
      return throwError(()=> err) }), // We return [] instead
      finalize(() =>  this.ngxService.stop())          
    );
  }
}
