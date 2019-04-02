import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import 'rxjs/Rx';

@Injectable()
export class OrderHistoryService {

  authToken: any;
  userId: any;
  allOrdersObservable: AngularFireList<any>;
  userObservable: AngularFireObject<any>;
  menuItemsObservable: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.allOrdersObservable = db.list("/orders/", ref => ref.orderByChild('userId').equalTo(this.userId));
    this.userObservable = db.object("users" + "/" + this.userId);
  }

  getCurrentUser() {
    return this.userObservable;
  }

  getOrderData() {
    return this.allOrdersObservable;
  }

  saveRatingAndReview(id, index, data) {
    return this.db.list("orders" + "/" + id + "/" + "cart" + "/" + index + "/" + "item").set("/review/", data);
  }

  getSpacificOrderRating(orderId) {
    return this.db.object("orders" + "/" + orderId);
  }

  saveReviewAtMenuItems(id, reviewBody) {
    return this.db.list("menuItems" + "/" + id + '/review/').push(reviewBody);
  }

  addRatingToMenuItem(id, data) {
    return this.db.list("menuItems").update(id, data);
  }
}