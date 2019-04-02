import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class WishListService {

  authToken: any;
  userId: any;
  favoritesObservalbe: AngularFireList<any>;
  constructor(db: AngularFireDatabase) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.favoritesObservalbe = db.list("/users/" + this.userId + "/" + "favourite");
  }

  getFavouritData() {
    return this.favoritesObservalbe;
  }

  deleteFavouritData(objId) {
    return this.favoritesObservalbe.remove(objId);
  }


}
