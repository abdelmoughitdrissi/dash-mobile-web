import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ContactService {
  contactsObservable: AngularFireList<any>;
  constructor(db: AngularFireDatabase) {
    this.contactsObservable = db.list("contact");
  }

  sendContacts(data) {
    return this.contactsObservable.push(data);
  }
}