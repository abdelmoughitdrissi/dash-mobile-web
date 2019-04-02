import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from './checkout.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

declare let paypal;


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CheckoutService]
})
export class CheckoutComponent implements OnInit {

  @ViewChild('closeUpdateModal') closeUpdateModal: ElementRef;
  @ViewChild('a') a: NgForm;
  addresStep = true;
  orderSummaryStep = false;
  paymentStep = false;
  editAddress1 = false;
  editAddress2 = false;
  activeClassVisible1 = true;
  activeClassVisible2 = false;
  activeClassVisible3 = false;

  addAddress = false;

  public newAddress: any = {};
  public card: any = {};
  public loylityPercentage: any;
  public savedAddresses: Array<any> = [];
  public allCouponsData: any = [];
  public hideCart: boolean = false;

  public checkOutInformation: any = {
    cart: [],
    couponDiscount: null,
    createdAt: null,
    deductedPrice: null,
    grandTotal: null,
    orderId: null,
    paymentStatus: null,
    paymentType: null,
    status: null,
    shippingAddress: {},
    transcationDetails: {},
    statusReading: {
      time: null,
      title: 'Your order has been accepted.You will get notified the status here.'
    },
    subTotal: null,
    tax: null,
    userDetails: {
      email: null,
      mobileNo: null,
      name: null,
      userid: null
    },
  };

  public orderData: any = {
    storeId: '',
    userId: '',
    payableAmount: Number,
    productDetails: [],
    orderType: 'cart',  //cart/uploaded
    orderBy: 'user',    //who orders users (role admin/seller/Employee etc)..
    paymentOption: '',  //Only COD or WALLET
    date: Number,
    month: Number,
    year: Number,
    shippingDetails: {},
    orderAmount: Number,
    timestamp: Number,
  };

  //Add and Update Address

  //private updateAddressId:any;
  public updateAddressData: any = {};
  public cardDetailList: any[] = [];
  // Shopping cart data members

  public cart: any = [];
  public total: number;
  // public shippingCharges: number = 25;
  public cartTotalAmount: number = 0;
  public payableAmount: number = 0;
  public GrandTotal: number = 0;
  public taxPercent: string = localStorage.getItem('tax');
  public taxAmount: number;
  public currency: string = localStorage.getItem('currency');
  public couponDiscountPercentage: number = 0;
  public couponName: string = 'No Coupon Applied';
  public deductedAmountByCoupon: number = 0;

  savedCard = true;
  addCard = false;
  cod = false;
  paypal = false;
  public orderPlacedObj: any = {};
  public stripeToken: any;
  public customerID: any;
  public payPalStaus: boolean = false;
  loyalityPoints: any[] = [];
  userLoylityPoints: any[] = [];

  public totalGainedLoyalityPointes: number = 0;
  public minLoyalityPointes: number = 0;
  public loyalityStatus: boolean = false;
  public canApplyLoyalityPointe: boolean = false;
  public applyLoyality: boolean = false;

  public usedLoyaltyPoints: number = 0;

  userData: AngularFireObject<any>;
  loyalityData: AngularFireObject<any>;

  pinDataRef: AngularFireList<any>;
  pinObservable: Observable<any>;
  public allPincodes: any[] = [];
  isDeliveryAvailable: boolean = false;

  userInfo: any = {};
  // private payPalEnvironmentSandbox = 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB';
  public publishableKey = 'pk_test_mhy46cSOzzKYuB2MuTWuUb34';
  public stripe_secret_key = 'sk_test_GsisHcPqciYyG8arVfVe2amE';
  constructor(public af: AngularFireDatabase, private restService: CheckoutService, private router: Router, private toastr: ToastrService) {

    this.pinDataRef = af.list('/delivery-options');
    this.userData = af.object('users' + '/' + this.checkOutInformation.userId);

    this.getUserAddresses();
    if (localStorage.getItem('cart') != null) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }
    if (this.cart.length === 0) {
      this.hideCart = true;
    }
    this.cartChanged();
    this.getCouponsData();
    this.getDeliveryAreaList();
    this.getloyalityPercentage();
    this.checkOutInformation.userId = localStorage.getItem('User_Id');

    this.loyalityData = af.object('/loyalitys');
    this.loyalityData.valueChanges().subscribe((res: any) => {
      if (res != null) {
        this.minLoyalityPointes = res.minLoyalityPointes;
        this.loyalityStatus = res.enable;
        console.log('minLoyalityPointes ------ ' + this.minLoyalityPointes);
        this.getUsers();
      }
    });
  }




  getUsers() {
    this.restService.getUserDetail().valueChanges().subscribe(
      (res: any) => {
        let data: any = res;
        this.checkOutInformation.userDetails.email = data.email;
        this.checkOutInformation.userDetails.mobileNo = data.mobileNo;
        this.checkOutInformation.userDetails.name = data.name;
        this.checkOutInformation.userDetails.userid = this.checkOutInformation.userId;

        if (data.loyaltyPoints && this.loyalityStatus) {
          this.restService.getUserLoality().valueChanges().subscribe((res: any) => {
            let value = 0;
            for (let i = 0; i < res.length; i++) {
              value += res[i].points;
              this.totalGainedLoyalityPointes = value;
            }
            if (this.totalGainedLoyalityPointes >= this.minLoyalityPointes) {
              this.canApplyLoyalityPointe = true;
            }
          })

          console.log('canApply && totalGainedLoyalityPointes' + this.canApplyLoyalityPointe + '  ' + this.totalGainedLoyalityPointes);
        }
      });
  }

  getDeliveryAreaList() {
    this.pinObservable = this.pinDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.pinObservable.subscribe((res) => {
      this.allPincodes = res;
    });
  }

  getUserAddresses() {
    this.restService.getAllSavedAddress().snapshotChanges().subscribe(
      (res) => {
        this.savedAddresses = [];
        res.forEach(items => {
          let item = items.payload.toJSON();
          item['_id'] = items.payload.key;
          this.savedAddresses.push(item);
        })
      }, (error) => {
        JSON.stringify(error);
        this.toastr.error('Error', 'Could not get user addresses', { timeOut: 2000 });
      });
  }

  getCouponsData() {
    this.restService.getCouponsData().valueChanges().subscribe(
      (res) => {
        this.allCouponsData = res;
      }, (error) => {
        JSON.stringify(error);
        this.toastr.error('Error', 'Could not get Coupons', { timeOut: 2000 });
      }
    )
  }

  getloyalityPercentage() {
    this.restService.getLoyalityPercentage().valueChanges().subscribe((res: any) => {
      this.loylityPercentage = res.loylityPercentage;
      this.minLoyalityPointes = res.minLoyalityPointes;
    })
  }

  ngOnInit() {

  }


  addresStepShow() {
    this.addresStep = true;
    this.orderSummaryStep = false;
    this.paymentStep = false;

    this.activeClassVisible1 = true;
    this.activeClassVisible2 = false;
    this.activeClassVisible3 = false;
  }


  orderSummaryStepShow(index) {
    for (let i = 0; i < this.savedAddresses.length; i++) {
      if (index == i) {
        this.savedAddresses[index].selected = true;
      }
      else {
        this.savedAddresses[i].selected = false;
      }
    }


    // let deliveryPin;
    // deliveryPin = Number(this.savedAddresses[index].pincode);
    // let newData = this.allPincodes.find(data => {
    //   return data.pincode === deliveryPin;
    // });
    // if (newData !== undefined) {
    this.checkOutInformation.shippingAddress = this.savedAddresses[index];
    this.isDeliveryAvailable = true;
    this.addresStep = false;
    this.orderSummaryStep = true;
    this.paymentStep = false;
    this.activeClassVisible1 = false;
    this.activeClassVisible2 = true;
    this.activeClassVisible3 = false;
    // }
    //  else {
    //   this.toastr.error('Delivery not available in this area', 'Delivery');
    // }

  }

  reduceQuantity(index) {
    console.log(index);
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

  applyCoupon(value) {
    var cpn = value.split('+');
    this.couponDiscountPercentage = cpn[0];
    this.couponName = cpn[1];
    this.cartChanged();
  }

  cartChanged() {
    var GTotal = 0;
    for (let i = 0; i <= this.cart.length - 1; i++) {
      GTotal = GTotal + this.cart[i].itemTotalPrice;
    }
    this.total = Number(GTotal);
    var GrandTotal = this.total;
    this.cartTotalAmount = GrandTotal;
    this.deductedAmountByCoupon = (this.cartTotalAmount * this.couponDiscountPercentage) / 100;
    this.cartTotalAmount = (this.cartTotalAmount - this.deductedAmountByCoupon);

    if (this.applyLoyality) {
      this.cartTotalAmount = this.cartTotalAmount - this.totalGainedLoyalityPointes;
      this.usedLoyaltyPoints = this.totalGainedLoyalityPointes;
    }

    if ((!this.applyLoyality) && (this.usedLoyaltyPoints > 0)) {
      this.usedLoyaltyPoints = 0;
    }

    this.payableAmount = this.cartTotalAmount;//payableAmount is Actual TotalAmount;
    this.taxAmount = (this.cartTotalAmount * (parseInt(this.taxPercent))) / 100;
    this.GrandTotal = this.cartTotalAmount + this.taxAmount;
  }

  applyLoyalityPoints(val) {
    if (this.totalGainedLoyalityPointes >= this.minLoyalityPointes) {
      this.applyLoyality = val;
      this.canApplyLoyalityPointe = true;
      this.cartChanged();
    }
    else {
      this.toastr.info('you don\'t have enough points', 'Loyality Point');
      this.applyLoyality = false;
    }
  }


  viewItem(itemId) {
    this.router.navigate(['single-product/' + itemId]);
  }

  OnDelete(index) {
    if (localStorage.getItem('cart') != null) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.cartChanged();
    }
    if (this.cart.length === 0) {
      this.hideCart = true;
    }
  }


  paymentStepShow() {

    if (this.checkOutInformation.shippingAddress.userName != '' && this.isDeliveryAvailable) {
      if (this.cart.length > 0) {
        this.checkOutInformation.cart = this.cart;
        this.checkOutInformation.grandTotal = this.GrandTotal;
        this.checkOutInformation.subTotal = this.payableAmount;
        this.checkOutInformation.tax = this.taxAmount;
        this.checkOutInformation.couponDiscount = this.couponDiscountPercentage;
        this.checkOutInformation.createdAt = Date.now();
        this.checkOutInformation.deductedPrice = this.deductedAmountByCoupon;
        this.checkOutInformation.orderId = Math.floor(Math.random() * 100000);
        this.checkOutInformation.status = 'pending';
        if (this.applyLoyality) {
          this.checkOutInformation.usedLoyaltyPoints = this.usedLoyaltyPoints;
        }
        this.addresStep = false;
        this.orderSummaryStep = false;
        this.paymentStep = true;
        this.activeClassVisible1 = false;
        this.activeClassVisible2 = false;
        this.activeClassVisible3 = true;
      }
      else {
        swal({
          title: 'Info!!!',
          text: 'Your cart is Empty, Please add some food items!...',
          background: '#fff',
          type: 'error',
          showConfirmButton: false,
          width: 300,
          timer: 3000
        }).then(
          function () {
          },
          // handling the promise rejection
          function (dismiss) {
            if (dismiss === 'timer') {
            }
          }
        )// swal end

      }
    }
    else {
      swal({
        title: 'Info!!!',
        text: 'Please select delivery address!...',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(
        function () {
        },
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') {

          }
        }
      )// swal end
    }

  }

  editAddressShow() {
    this.editAddress1 = true;
    this.editAddress2 = false;
    this.addAddress = false;
  }

  editAddressShow2() {
    this.editAddress1 = false;
    this.editAddress2 = true;
    this.addAddress = false;
  }

  addAddressShow() {
    this.addAddress = true;
    this.editAddress1 = false;
    this.editAddress2 = false;
  }

  savedCardShow() {
    this.savedCard = true;
    this.addCard = false;
    this.cod = false;
    this.paypal = false;
    this.checkOutInformation.paymentType = 'CARD';
    this.checkOutInformation.paymentStatus = false;

  }

  onSelectCard(item) {
    this.stripeToken = item.customerId;
  }

  addCardShow() {
    this.addCard = true;
    this.cod = false;
    this.savedCard = false;
    this.paypal = false;
    this.checkOutInformation.paymentType = 'CARD';
    this.checkOutInformation.paymentStatus = false;
  }

  codShow() {
    this.cod = true;
    this.checkOutInformation.paymentType = 'COD';
    this.checkOutInformation.paymentStatus = false;
    this.savedCard = false;
    this.addCard = false;
    this.paypal = false;
  }

  paypalShow() {
    this.paypal = true
    this.cod = false;
    this.checkOutInformation.paymentType = 'COD';
    this.checkOutInformation.paymentStatus = false;
    this.savedCard = false;
    this.addCard = false;
  }


  selectExtraIngredient(i, j) {
    let x = this.cart[i].item.itemQunatity;
    // this.cart[j].item.extraOptions[i].selected = !this.cart[j].item.extraOptions[i].selected;
    if (this.cart[i].item.extraOptions[j].selected) {
      for (let z = 1; z <= x; z++) {
        this.cart[i].itemTotalPrice = this.cart[i].itemTotalPrice + (this.cart[i].item.extraOptions[j].value);
      }
    } else {
      for (let z = 1; z <= x; z++) {
        this.cart[i].itemTotalPrice = this.cart[i].itemTotalPrice - (this.cart[i].item.extraOptions[j].value);
      }
    }

  }
  placeOrderOnPayPal() {
    this.payPalStaus = true;
    this.restService.placeOrder(this.checkOutInformation).then((res: any) => {
      this.orderPlacedObj = res;
      this.payWithPaypal();
    }, (error) => {
      JSON.stringify(error);

    })
  }

  payWithPaypal() {
    let payableAmount = this.GrandTotal.toFixed(2);
    let that = this;

    paypal.Button.render({

      env: 'sandbox', // Or 'sandbox'

      client: {
        sandbox: 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB',
        // production: ''
      },

      commit: true, // Show a 'Pay Now' button

      payment: function (actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: payableAmount, currency: 'USD' }
              }
            ]
          }
        });
      },

      onAuthorize: function (actions) {
        return actions.payment.execute().then(function (payment) {
          // do not remove this line, its required
          // The payment is complete!
          // You can now show a confirmation message to the customer
          that.checkOutInformation.transcationDetails = payment;
          that.checkOutInformation.paymentType = 'PayPal';
          that.checkOutInformation.paymentStatus = true;
          that.restService.updateOrder(that.orderPlacedObj.key, that.checkOutInformation).then(
            () => {
              swal({
                title: 'Thank you',
                text: 'Your order has been placed',
                background: '#fff',
                type: 'success',
                showConfirmButton: false,
                width: 300,
                timer: 1200
              }).then(() => {
              }, () => {
              });
              localStorage.removeItem('cart');
              that.router.navigate(['/thanks']);
            }).catch(
              () => {
                swal({
                  title: 'Sorry..',
                  text: 'Could not place the order',
                  background: '#fff',
                  type: 'error',
                  showConfirmButton: false,
                  width: 300,
                  timer: 1200
                }).then(() => {
                }, () => {
                });
              }
            );
        });
      }

    }, document.getElementById('paypal-button'));
  }

  openCheckout() {
    if (this.GrandTotal > 50) {
      this.restService.placeOrder(this.checkOutInformation).then((res: any) => {
        this.orderPlacedObj = res;
        let that = this;
        var handler = (<any>window).StripeCheckout.configure({
          key: that.publishableKey,
          locale: 'auto',
          token: function (token: any) {

            that.restService.chargeStripe(token.id, 'usd', Math.round(that.GrandTotal), that.stripe_secret_key).then(() => {
              //that.checkOutInformation.transcationDetails = res.balance_transaction;
              that.checkOutInformation.paymentType = 'Stripe';
              that.checkOutInformation.paymentStatus = true;

              //-------------

              that.restService.updateOrder(that.orderPlacedObj.key, that.checkOutInformation).then(
                () => {
                  swal({
                    title: 'Thank you',
                    text: 'Your order has been placed',
                    background: '#fff',
                    type: 'success',
                    showConfirmButton: false,
                    width: 300,
                    timer: 1200
                  }).then(() => {
                  }, () => {
                  });
                  localStorage.removeItem('cart');
                  that.router.navigate(['/thanks']);
                }).catch(
                  () => {
                    swal({
                      title: 'Sorry..',
                      text: 'Could not place the order',
                      background: '#fff',
                      type: 'error',
                      showConfirmButton: false,
                      width: 300,
                      timer: 1200
                    }).then(() => {
                    }, () => {
                    });
                  }
                );

            }).catch(() => {
              that.toastr.error('Error', 'Somthing Went wrong', { timeOut: 2000 });
            })

          }
        });

        handler.open({
          name: 'Stripe Payment',
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          description: 'widgets',
          amount: Math.round(100 * Number(that.GrandTotal.toFixed(0)))
        });
      }, (error) => {
        JSON.stringify(error);

      })
    } else {
      this.toastr.info('Info', 'Amount greater than $50', { timeOut: 2000 });
    }
  }


  orderPlaced() {
    // for loylity program
    // ------------------- //
    this.checkOutInformation.statusReading.time = Date.now();
    this.checkOutInformation.orderView = false;
    this.restService.placeOrder(this.checkOutInformation).then((res: any) => {
      if (this.applyLoyality) {
        let deductedData: number = 0;
        deductedData = -(this.usedLoyaltyPoints);
        let loayltyObj: any = {
          credit: false,
          points: deductedData,
          orderId: res.key,
          createdAt: Date.now()
        }
        this.af.list('users/' + this.checkOutInformation.userId + '/loyaltyPoints').push(loayltyObj);
        this.af.list('/orders/' + res.key + '/loyaltyPoints').push(loayltyObj)
      }
      this.router.navigate(['/thanks']);
      localStorage.removeItem('cart');
      swal({
        title: 'Thank You..',
        text: 'Your order has been placed!...',
        background: '#fff',
        type: 'success',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(
        function () {
        },
        function (dismiss) {
          if (dismiss === 'timer') {

          }
        });
    }, (error) => {
      JSON.stringify(error);
      swal({
        title: 'Error!!!',
        text: 'Something is going wrong!...',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(
        function () {
        },
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') {
          }
        }
      )// swal end
    })
  }

  getSingleAddressData(index) {
    this.updateAddressData = this.savedAddresses[index];
  }

  onUpdateAddress(ngform: NgForm) {
    this.restService.updateAddress(ngform.value, this.updateAddressData._id).then(
      () => {
        swal({
          title: 'Cool!!',
          text: 'Address added successfully',
          background: '#fff',
          type: 'success',
          showConfirmButton: false,
          width: 300,
          timer: 1500
        }).then(() => {
        }, () => {
        });
        this.closeUpdateModal.nativeElement.click();
        this.getUserAddresses();
      }
    ).catch(
      (error) => {
        this.toastr.error('Error', error.message, { timeOut: 2000 });
      }
    )
  }

  clearForm() {
    this.a.reset();
  }


  update() {
    //  this.restService.updateAddressData(this.updateAddressData, this.updateAddressId).subscribe((res)=>{
    //   this.onCloseReportModal();
    //   this.getUserAddresses();
    // },()=>{
    //   this.onCloseReportModal();
    // })
  }

  public onCloseReportModal(): void {
    this.closeUpdateModal.nativeElement.click();
  }

  onSaveNewAddress(ngform: NgForm) {
    this.restService.saveAddress(ngform.value).then(
      () => {
        swal({
          title: 'Cool!!',
          text: 'Address added successfully',
          background: '#fff',
          type: 'success',
          showConfirmButton: false,
          width: 300,
          timer: 1500
        }).then(() => {
        }, () => {
        });
        this.getUserAddresses();
        this.a.reset();
      }, (error) => {
        this.toastr.error('Error', error.message, { timeOut: 2000 });
      }
    );
  }
}
