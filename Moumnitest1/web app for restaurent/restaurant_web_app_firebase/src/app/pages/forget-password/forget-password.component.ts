import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  isEmailVerified: boolean = false;
  email: string;

  constructor(private toastr: ToastrService, private db: AngularFireDatabase, private auth: AngularFireAuth) {
  }

  ngOnInit() {
  }

  verifyEmail(form: NgForm) {
    this.email = form.value.email;
    this.db.list('users', ref => ref.orderByChild('email').equalTo(form.value.email)).valueChanges().subscribe(data => {
      if (data.length === 0) return this.toastr.error('No such User record exists', 'Error', { timeOut: 3000 });
      if (data.length > 0) {
        this.auth.auth.sendPasswordResetEmail(form.value.email).then(() => {
          this.isEmailVerified = true;
        }).catch(error => this.toastr.error(error.message, 'Error', { timeOut: 3000 }));
      }
      form.reset();
    });
  }
}