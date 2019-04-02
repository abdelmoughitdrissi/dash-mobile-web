import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, AuthService]
})
export class LoginComponent implements OnInit {

  public signinForm: FormGroup;
  public rememberMe: boolean = false;

  constructor(private _cookieService: CookieService, private fb: FormBuilder, private restService: LoginService) {
    this.createForm();
    this.getCookie();
  }

  getCookie() {  // function used for getting data from cookie
    let rememberMeData: any = {};
    rememberMeData = this._cookieService.getObject('rememberMe');
    if (rememberMeData != undefined) {
      this.signinForm.get('email').setValue(rememberMeData.email);
      this.signinForm.get('password').setValue(rememberMeData.password);
    }
    else {
    }
  }

  createForm() {
    this.signinForm = this.fb.group({
      email: ['ionicfirebaseapp@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['123456', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
  }

  onSubmit() {
    if (this.rememberMe) {
      this._cookieService.putObject("rememberMe", this.signinForm.value);
    }
    this.restService.loginWithEmailAndPassword(this.signinForm.value);
  }

  ngOnInit() {
  }

}
