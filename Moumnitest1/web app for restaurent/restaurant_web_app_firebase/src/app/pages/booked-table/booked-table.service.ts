import { Injectable } from '@angular/core';
import { AngularFireList,AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';

@Injectable()
export class BookedTableService {

  authToken:any;
  userId:any;
  bookingsObservable:AngularFireList<any>;
    constructor(db:AngularFireDatabase) {
       this.authToken=localStorage.getItem('token');
       this.userId = localStorage.getItem('User_Id');
       this.bookingsObservable = db.list("table-bookings");
    }

    getBookedTablesData(){
      return this.bookingsObservable;
    }
}
