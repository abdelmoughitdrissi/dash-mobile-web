import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderHistoryService } from './order-history.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [OrderHistoryService]
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('notUse') a: NgForm;
  _page: number = 1;
  _limit: number = 3;
  _total: number;
  public allOrders: any[] = [];
  public cartData: Array<any> = [];
  protected uniqueKey: string;
  currentIndex: number;
  public currency: string = localStorage.getItem('currency');
  // public orderDetails:Array<any>[];
  public ratingStates: any = [
    {
      stateOn: 'fa fa-star',
      stateOff: 'fa fa-star-o'
    },
  ];
  //public rating:any;
  public maxRat: number = 5;
  public isReadonly: boolean = false;
  noOfRating: number;
  userId: string;
  review: any = {
    rating: '',
    comment: '',
    userId: localStorage.getItem('User_Id'),
    menuItemId: ''
  }

  orderInfo: Array<any>;
  orderData: any;
  userInfo: any;
  productId: string;
  orderDetails: any = {
    cart: [],
    shippingAddress: {}
  };


  constructor(private restService: OrderHistoryService, private router: Router) {
    this.userId = localStorage.getItem('User_Id');
    // this.getUserData();
    this.getOrdersData();
  }

  getUserData() {
    this.restService.getCurrentUser().valueChanges().subscribe(
      (res) => {
        this.userInfo = res;
      }
    );
  }

  getOrdersData() {
    if (this.userId !== null || this.userId !== undefined) {
      this.restService.getOrderData().snapshotChanges()
        .map(changes => {
          return changes.map(c => ({ _id: c.payload.key, ...c.payload.val() }));
        })
        .subscribe(
          (res) => {
            this.allOrders = res.reverse();
            this._total = this.allOrders.length;
          }, () => {
          });
    } else {
      swal({
        title: 'Please Login',
        text: 'login to view orders',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(() => {
      }, () => {
      });
    }
  }

  viewDetail(ind, orderId) {
    this.orderDetails = this.allOrders[ind];
    this.orderData = this.allOrders[ind].cart;
    // for(var val of data.cart){
    //   this.orderData = val;
    // }
    this.restService.getSpacificOrderRating(orderId).valueChanges()
      .subscribe(() => {
      })
  }

  getOrderDetails(data) {
    let value = data.cart;
    this.orderInfo = value;
  }

  rateProduct(productId, id, index) {
    this.productId = productId;
    this.review.menuItemId = productId;
    this.uniqueKey = id;
    this.currentIndex = index;
  }

  onSaveRatingData() {
    var body = {
      comment: this.review.comment,
      rating: this.review.rating,
      userId: this.userId
    }
    this.restService.saveRatingAndReview(this.uniqueKey, this.currentIndex, body).then(
      () => {
        swal({
          title: 'Thanks for rating the product',
          text: 'Your review and rating has been saved',
          background: '#fff',
          type: 'success',
          showConfirmButton: false,
          width: 300,
          timer: 2000
        }).then(() => {
        }, () => {
        });
        var reviewBody = {
          comment: this.review.comment,
          rating: this.review.rating,
          userId: this.userId
        }

        this.restService.saveReviewAtMenuItems(this.review.menuItemId, reviewBody).then(() => {
          //console.log('Added review and rating');
        });
        this.closeModal();
      });
  }

  ngOnInit() {
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
    this.review.comment = '';
    this.review.menuItem = '';
    this.review.userId = '';
    this.review.rating = '';
  }

  viewItem(item) {
    this.router.navigate(['products/' + item.item.itemId]);
  }

  orders = [
    {
      'img': 'assets/img/product/food.jpg',
      'title': 'Fresh Biryani',
      'price': '$34'
    },
    {
      'img': 'assets/img/product/food2.jpg',
      'title': 'Fresh chicken',
      'price': '$89',
    },
  ];
}
