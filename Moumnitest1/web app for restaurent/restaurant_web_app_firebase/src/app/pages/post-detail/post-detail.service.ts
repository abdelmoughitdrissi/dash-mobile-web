import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class PostDetailService {

  constructor(private db: AngularFireDatabase) { }

  getComments(id: string) {
    return this.db.list("/news/" + id + "/" + "comment");
  }

  postComment(id, data) {
    return this.db.list('/news/' + id + "/" + "comment").push(data);
  }
}
