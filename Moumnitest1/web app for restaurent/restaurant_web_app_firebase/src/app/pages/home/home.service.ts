import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';
@Injectable()
export class HomeService {

  authToken: any;
  userId: any;
  tableBookingObservable: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.tableBookingObservable = db.list("table-bookings");
  }

  getRecentCategoryData() {
    return this.db.list("categories");
  }

  getRecentTestimonialData() {
    return this.db.list("testimonials", ref => ref.limitToFirst(6));
  }


  getProductData() {
    return this.db.list("menuItems", ref => ref.limitToFirst(12));
  }

  bookTable(userData) {
    return this.tableBookingObservable.push(userData);
  }
}
