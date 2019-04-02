import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class SignupService {

  constructor(public http: Http,
    private af: AngularFireAuth,
    private db: AngularFireDatabase,
    private toastrSrv: ToastrService,
    private router: Router) {
  }


  createNewUser(data: any) {
    this.af.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then(
      (success) => {
        this.db.object('/users/' + success.uid).update({
          name: data.name,
          email: data.email,
          mobileNo: data.phone,
          role: 'User'
        })
          .then(
          () => {
            this.toastrSrv.success('Success', 'Registered Successfully', { timeOut: 2000 });
            this.router.navigate(['login']);
          }
          ).catch(
          error => {
            this.toastrSrv.error('Error', error.message, { timeOut: 2500 });
          }
          );
      }
      ).catch(error => this.toastrSrv.error(error.message, 'Error', { timeOut: 3000 }));
  }
}
