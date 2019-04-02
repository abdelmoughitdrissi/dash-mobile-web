import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList,AngularFireDatabase } from 'angularfire2/database';
import {Http, Response} from "@angular/http";
import { Observable } from "rxjs/Rx";
import { instagramURL } from '../../firebase.config';
@Injectable()
export class FooterService {

  // authToken:any;
  // userId:any;
  contactObservable:AngularFireList<any>;
  subscribeObservable:AngularFireList<any>;

    constructor(private db:AngularFireDatabase, private http:Http) {
       this.contactObservable = db.list("contact");
       this.subscribeObservable = db.list("subscribe");
    }

  contactUs(contactData){
    return this.contactObservable.push(contactData);
  }

  subscribeMe(subscribeData){
    return this.subscribeObservable.push(subscribeData);
  }

  getRecentNewsData(){
      return this.db.list("news", ref => ref.limitToFirst(2));
    }

  instaData() {
    return this.http.get(instagramURL)
      .map((data: Response) => data.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.json());

  }

}
