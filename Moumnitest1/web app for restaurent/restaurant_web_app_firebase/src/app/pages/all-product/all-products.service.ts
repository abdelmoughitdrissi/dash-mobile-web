import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AllProductsService {

    authToken:any;
    userId:any;
    allProductObservable:AngularFireList<any>;

    constructor(db:AngularFireDatabase) {
       this.authToken=localStorage.getItem('token');
       this.userId = localStorage.getItem('User_Id');
       this.allProductObservable = db.list('menuItems')
    }
    
    getAllProducts(){
        return this.allProductObservable;
    }
}
