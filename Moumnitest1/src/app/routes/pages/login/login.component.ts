import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  valForm: FormGroup;
  rememberMe: boolean = false;
  isLoading: boolean = false;
  public imageLogo: string = '';

  constructor(private _http: Http, private _cookieService: CookieService, public af: AngularFireAuth, public settings: SettingsService, fb: FormBuilder, public router: Router, public db: AngularFireDatabase, public toastr: ToastrService) //,public toastr: ToastrService
  {
    this.valForm = fb.group({
      'email': ['abd1000a1@gmail.com', Validators.compose([Validators.required, CustomValidators.email])],
      'password': ['istantic', Validators.required]
    });
    this.getLoginImage();
    this.getCookie();
  }

  getLoginImage() {
    this.db.object('settings').valueChanges().subscribe((res: any) => {
      if (res) {
        if (res.currency) {
          localStorage.setItem('currency', JSON.stringify(res.currency));
        } else {
          localStorage.setItem('currency', JSON.stringify({ currencyName: 'USD', currencySymbol: '$' }));
        }
        if (res.imageLogo != null) {
          this.imageLogo = res.imageLogo;
        } else {
          this.imageLogo = 'assets/img/logo.png';
        }
      } else {
        this.imageLogo = 'assets/img/logo.png';
      }
    }, error => {
      localStorage.setItem('currency', JSON.stringify({ currencyName: 'USD', currencySymbol: '$' }));
      this.imageLogo = 'assets/img/logo.png';
    })
  }

  getCookie() {
    let rememberMeData: any = {};
    rememberMeData = this._cookieService.getObject('rememberMe');
    if (rememberMeData != undefined) {
      this.valForm.get('email').setValue(rememberMeData.email);
      this.valForm.get('password').setValue(rememberMeData.password);
    }
  }


  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.isLoading = !this.isLoading;
      if (this.rememberMe) {
        this._cookieService.putObject('rememberMe', this.valForm.value)
      }

      this.af.auth.signInWithEmailAndPassword(value.email, value.password).then((success) => {
        this.db.object('/users/' + success.uid).valueChanges().subscribe((res: any) => {

          if (res.role == "Admin") {
            this.router.navigate(['home']);
            localStorage.setItem('uid', success.uid)
            this.toastr.success('Login Successfully!', 'Success!');
            this.isLoading = !this.isLoading;

          } else {
            this.toastr.error('Login Failed!', 'You are not an ADMIN!');
            this.isLoading = !this.isLoading;
          }
        })
      })
    }
  }


  checkMe() {

  }

  ngOnInit() {

  }

}
