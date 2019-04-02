import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { LoginService } from "./login.service";

@Injectable()
export class AuthService implements CanActivate {

  constructor(private loginService: LoginService) { }

  canActivate(): Observable<boolean> | boolean {
    //this.router.navigate(['/home']);
    return (this.loginService.isAuthenticated());
  }
}
