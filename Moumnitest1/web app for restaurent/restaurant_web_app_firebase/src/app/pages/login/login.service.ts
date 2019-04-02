import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoginService {
  user: any;
  constructor(
    private af: AngularFireAuth,
    private toastrService: ToastrService,
    private router: Router,
    private db: AngularFireDatabase
  ) { }
  //Authentication
  isAuthenticated() {

    this.user = localStorage.getItem('token') !== null;
    var subscription = localStorage.getItem('auth') == 'Activated';
    if (subscription) {
      return true;
    } else {
      return false;
    }
  }

  loginWithEmailAndPassword(data) {
    this.af.auth.signInWithEmailAndPassword(data.email, data.password)
      .then(
      () => {
        this.toastrService.success("Success", "Login Successful", { timeOut: 2000 });
        localStorage.setItem("User_Id", this.af.auth.currentUser.uid);
        localStorage.setItem('auth', 'Activated');
        let id = this.af.auth.currentUser.uid;
        var data = this.db.object('/users/' + id);
        let val;
        data.valueChanges().subscribe(
          (res) => {
            // console.log(res);
            val = res;
            if (val.image != null || val.image != undefined) {
              localStorage.setItem('user_image', val.image);
            }
          }
        );
        this.router.navigate(['home']);
      }
      ).catch(
      (error) => {
        this.toastrService.error("Error", error.message, { timeOut: 2000 });
      }
      );
  }
}

