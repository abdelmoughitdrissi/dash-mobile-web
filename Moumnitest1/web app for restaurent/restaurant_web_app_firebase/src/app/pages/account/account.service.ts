import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';

@Injectable()
export class AccountService {

  authToken: any;
  userId: any;
  userObservable: AngularFireList<any>;
  userAddressObservable: AngularFireList<any>;
  constructor(private db: AngularFireDatabase, private af: AngularFireAuth) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.userObservable = db.list("users" + "/" + this.userId);
    this.userAddressObservable = db.list("users" + "/" + this.userId + "/" + "address");
  }

  getUserDetail() {
    return this.db.object("users" + "/" + this.userId);
  }

  updateUserData(data) {
    return this.db.object("users" + "/" + this.userId).update(data);
  }

  updatePassword(email) {
    return this.af.auth.sendPasswordResetEmail(email);
  }

  saveAddress(data) {
    return this.userAddressObservable.push(data);
  }

  getAllSavedAddress() {
    return this.userAddressObservable;
  }

  deleteAddress(objId) {
    return this.userAddressObservable.remove(objId);
  }

  updateAddressData(data, obj_id: any) {
    return this.userAddressObservable.update(obj_id, data);
  }
}
