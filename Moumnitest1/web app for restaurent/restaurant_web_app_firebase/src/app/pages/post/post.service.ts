import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class PostService {

  contactObservable: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) {
  }

  getRecentNewsData() {
    return this.db.list("news");
  }

}
