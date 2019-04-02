import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { firebaseConfigTwo } from '../../../../firebase.config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  userDetails: any = {};
  public fireUid: any;
  constructor(private route: ActivatedRoute,
    public router: Router,
    public af: AngularFireDatabase,
    public authentication: AngularFireAuth,
    public toastr: ToastrService) {

    this.af.object('/users');
  }
  onAddUsers(form: NgForm) {
    console.log("Users Data : " + JSON.stringify(this.userDetails));
    /*    this.authentication.auth.createUserWithEmailAndPassword(this.userDetails.email, this.userDetails.password)
     .then(success => {
       console.log("Auth Uid"+success.auth.uid );
            this.af.object('/users/'+ success.auth.uid).update({
                  email:this.userDetails.email,
               name:this.userDetails.name,
               mobileNo:this.userDetails.mobileNo,
               role:'User'
       }).then((res)=>{
       console.log("Success");
        this.router.navigate(['/users/manageUsers'])
     })
  })
    */
    //   var config = {apiKey: "apiKey",
    // authDomain: "projectId.firebaseapp.com",
    // databaseURL: "https://databaseName.firebaseio.com"};
    var secondaryApp = firebase.initializeApp(firebaseConfigTwo, "secondary");

    secondaryApp.auth().createUserWithEmailAndPassword(this.userDetails.email, this.userDetails.password).then(res => {

      this.af.object('/users/' + res.uid).update({
        email: this.userDetails.email,
        name: this.userDetails.name,
        mobileNo: this.userDetails.mobileNo,
        role: 'User'
      }).then(response => {
        secondaryApp.auth().signOut();
        this.toastr.success('User Added Successfully !', 'Success!');
        this.router.navigate(['/users/manageUsers'])
      }).catch(error => {
        this.toastr.error('User Not Added!', 'Error!');
      })
    })



  }
  cancel() {
    this.router.navigate(['/users/manageUsers'])
  }

}
