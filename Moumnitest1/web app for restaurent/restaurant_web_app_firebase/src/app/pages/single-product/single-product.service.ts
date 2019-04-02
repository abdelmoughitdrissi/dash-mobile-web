import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SingleProductService {

  authToken: any;
  userId: any;
  singleProductObservable: AngularFireObject<any>;
  addFavorites: AngularFireList<any>;
  constructor(private af: AngularFireDatabase) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.addFavorites = this.af.list("/favorites/");
  }

  getMenuItemData(menuItemId) {
    return this.af.object("menuItems" + "/" + menuItemId);
  }

  getRatingData(menuItemId) {
    console.log(menuItemId);
    return this.af.list("/orders/", ref => ref.orderByChild('userId').equalTo(this.userId));
  }

  checkFavouritData(userId, menuItemId) {
    console.log(menuItemId);
    return this.af.object("users/" + userId + "/favourite/" + menuItemId);
  }

  getSettingsData() {

    return this.af.object("/settings");
  }

  deleteFavouritData(userId, objId) {

    return this.af.object("/users/" + userId + "/" + "favourite" + "/" + objId).remove();
  }

  saveFavourit(menuItemId, userId, data) {
    // const body:any ={
    //   userReaction:'LIKE',
    //   user:userId,
    //   menuItem:menuItemId,
    //   thumb:data
    // };
    return this.af.list("/users/" + userId + "/" + "favourite").set(menuItemId, data);
  }
}
