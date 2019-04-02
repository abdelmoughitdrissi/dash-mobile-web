import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './header.service'
import { cart } from '../../app';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
  searchVisible = false;
  userAuth = false;
  public currency: string = localStorage.getItem('currency');
  public cart: cart[] = []

  constructor(private router: Router, public headerService: HeaderService, private toastr: ToastrService) {
    this.check();
  }

  viewItem(itemId) {
    this.router.navigate(['single-product/' + itemId]);//
  }

  gotoCheckout() {
    //console.log("Header : gotoCheckout ");
    if (localStorage.getItem('auth')) {
      //console.log("Header : gotoCheckout : If");
      this.router.navigate(['/checkout']);
    }
    else {
      //console.log("else");
      swal({
        title: 'Opss!!!',
        text: 'Please Login or Register first!...',
        background: '#fff',
        type: 'info',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(
        function () { },
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') {
            //console.log('I was closed by the timer')
          }
        }
      )// swal end

      this.router.navigate(['login']);
    }

  }

  check() {
    if (localStorage.getItem('auth')) {
      return true;
    }
    else {
      return false;
    }
  }

  checkCart() {
    this.headerService.getCartData().subscribe(res => {
      this.cart = res;
    })
    return this.cart.length;
  }

  // ON Delete
  OnDelete(index) {
    if (localStorage.getItem('cart') != null) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      //this.cartChanged();
      swal({
        title: 'Opss!!!',
        text: 'Food Item removed from card!...',
        background: '#fff',
        type: 'info',
        showConfirmButton: false,
        width: 300,
        timer: 1000
      }).then(
        function () { },
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') {
            //console.log('I was closed by the timer')
          }
        }
      )// swal end
    }
  }
  ngOnInit() {
  }

  search() {
    this.searchVisible = true;
  }

  logout() {
    this.headerService.signOut().then(
      () => {
        this.toastr.success("Success", "Logout successful", { timeOut: 2000 });
        // localStorage.clear();
        localStorage.removeItem("User_Id");
        localStorage.removeItem("auth");
        localStorage.removeItem('user_image');
        this.router.navigate(['home']);
      }, (error) => {
        this.toastr.error("Error", error.message, { timeOut: 2000 });
      }
    )
  }

  cartItem = [{
    'img': 'assets/img/product/food.jpg',
    'title': 'abana',
    'price': '16$',
    'qty': '2',
  },
  {
    'img': 'assets/img/product/food2.jpg',
    'title': 'Panadol',
    'price': '46$',
    'qty': '1',
  },
  {
    'img': 'assets/img/product/food3.jpg',
    'title': 'VapDrops',
    'price': '6$',
    'qty': '2',
  },
  {
    'img': 'assets/img/product/food4.jpg',
    'title': 'benosen',
    'price': '12$',
    'qty': '8',
  },
  ];
}