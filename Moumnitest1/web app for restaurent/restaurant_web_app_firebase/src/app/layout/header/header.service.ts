'use strict'
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()

export class HeaderService {
    constructor(public http: Http, private af: AngularFireAuth) {
    }

    getCartData(): Observable<any> {
        let observable = new Observable(observer => {
            if (localStorage.getItem('cart') != null) {
                var data = JSON.parse(localStorage.getItem('cart'))
                observer.next(data);
            } else {
                observer.next(0);
            }
        })
        return observable;
    }

    signOut() {
        return this.af.auth.signOut();
    }
}