import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public cart: any = [];
  public total: any;
  public taxAmount: number; // static 
  public cartTotalAmount: number = 0;
  public GrandTotal: number = 0;
  public hideCart: boolean = false;
  public extraPrice: number;
  public extraOption;
  public tax = parseInt(localStorage.getItem('tax'));
  public currency: string = localStorage.getItem('currency');
  constructor(private router: Router) {
    if (localStorage.getItem('cart') != null) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
      console.log(this.cart);
      // this.extraOption = JSON.parse(localStorage.getItem('cart'));
    }
    //console.log(this.cart);
    this.cartChanged();
    if (this.cart.length === 0) {
      this.hideCart = true;
    }
  }

  selectExtraIngredient(i, j) {
    console.log(i, j);
    let x = this.cart[i].item.itemQunatity;
    // this.cart[j].item.extraOptions[i].selected = !this.cart[j].item.extraOptions[i].selected;
    if (this.cart[i].item.extraOptions[j].selected) {
      console.log('if');

      for (let z = 1; z <= x; z++) {
        this.cart[i].itemTotalPrice = this.cart[i].itemTotalPrice + (this.cart[i].item.extraOptions[j].value);
      }
    } else {
      for (let z = 1; z <= x; z++) {
        console.log('else');
        this.cart[i].itemTotalPrice = this.cart[i].itemTotalPrice - (this.cart[i].item.extraOptions[j].value);
      }
    }

  }

  reduceQuantity(index) {
    let total = 0;
    if (this.cart[index].item.itemQunatity > 1) {
      this.cart[index].item.itemQunatity = this.cart[index].item.itemQunatity - 1;
      if (this.cart[index].item.extraOptions.length) {
        this.cart[index].item.extraOptions.forEach(data => {
          if (data.selected === true) {
            total = total + data.value;
          }
          else {
            total = total;
          }
        });
        this.cart[index].itemTotalPrice = ((this.cart[index].item.price.value + total) * this.cart[index].item.itemQunatity);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartChanged();
      } else {
        this.cart[index].itemTotalPrice = (this.cart[index].item.price.value * this.cart[index].item.itemQunatity);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartChanged();
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }

  }

  addQuantity(index) {
    let total = 0;
    if (this.cart[index].item.itemQunatity < 10) {
      this.cart[index].item.itemQunatity = this.cart[index].item.itemQunatity + 1;
      if (this.cart[index].item.extraOptions.length) {
        this.cart[index].item.extraOptions.forEach(data => {
          if (data.selected === true) {
            total = total + data.value;
          }
          else {
            total = total;
          }
        });
        this.cart[index].itemTotalPrice = ((this.cart[index].item.price.value + total) * this.cart[index].item.itemQunatity);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartChanged();
      } else {
        this.cart[index].itemTotalPrice = (this.cart[index].item.price.value * this.cart[index].item.itemQunatity);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartChanged();
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }

  }

  cartChanged() {
    var GTotal = 0;
    for (let i = 0; i <= this.cart.length - 1; i++) {
      GTotal = GTotal + this.cart[i].itemTotalPrice;
    }
    this.total = Number(GTotal);
    var GrandTotal = this.total;
    this.cartTotalAmount = GrandTotal;
    this.taxAmount = (this.cartTotalAmount * this.tax) / 100;
    this.GrandTotal = this.cartTotalAmount + this.taxAmount;
  }

  viewItem(itemId) {
    this.router.navigate(['single-product/' + itemId]);//
  }

  gotoCheckout() {
    if (localStorage.getItem('auth')) {
      this.router.navigate(['/checkout']);
    }
    else {
      swal({
        title: 'Checkout!!!',
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

          }
        }
      )// swal end
    }
  }

  // ON Delete
  OnDelete(index) {
    if (localStorage.getItem('cart') != null) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.cartChanged();
      if (this.cart.length === 0) {
        this.hideCart = true;
      }
    }
  }


  ngOnInit() {
  }
}
