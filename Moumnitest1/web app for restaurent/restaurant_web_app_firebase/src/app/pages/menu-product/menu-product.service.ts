import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database'; 

@Injectable()
export class MenuProductService {

  authToken:any;
  userId:any;
  menuProductObservable:AngularFireList<any>;
    constructor(private db:AngularFireDatabase) {
       this.authToken=localStorage.getItem('token');
       this.userId = localStorage.getItem('User_Id');
    }

    getProductsData(menuId){
      this.menuProductObservable = this.db.list("menuItems",ref => ref.orderByChild("category").equalTo(menuId));
      return this.menuProductObservable;
    }

    getCategoryDetails(id){
      return this.db.object("categories"+"/"+id);
    }
}
