import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class MenuListService {

  authToken: any;
  userId: any;
  allCategoryObservable: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('id');
  }

  getAllMenus() {
    this.allCategoryObservable = this.db.list("categories");
    return this.allCategoryObservable;
  }

}
