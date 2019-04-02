// import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { UUID } from 'angular2-uuid';
import { SingleProductService } from './pages/single-product/single-product.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [SingleProductService]

})

export class AppComponent implements OnInit {
  public myName: string = "myName ";
  constructor(private router: Router, private db: AngularFireDatabase, private restService: SingleProductService) {
    this.getItemRating();
    if (localStorage.getItem('auth')) {
      this.db.list('users').valueChanges().subscribe(() => {
      }, () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        localStorage.removeItem('User_Id');
      })
    }
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      localStorage.removeItem('User_Id');
    }
  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    let uuid = UUID.UUID();
    console.log(uuid);
  }

  getItemRating() {
    this.restService.getSettingsData().valueChanges().subscribe((res: any) => {
      if (res.currency != undefined) {
        localStorage.setItem('currency', res.currency.currencySymbol);
        localStorage.setItem('tax', res.currency.totalVat);
      } else {
        localStorage.setItem('currency', '$')
      }

      if (res.totalVat != undefined) {
        localStorage.setItem('tax', res.totalVat);
      } else {
        localStorage.setItem('tax', '0');
      }

    }, () => {

    })
  }
}
