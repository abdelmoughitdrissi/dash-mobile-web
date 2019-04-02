import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Http, Headers, URLSearchParams } from '@angular/http';






@Injectable()
export class CheckoutService {

  authToken: any;
  userId: any;
  newAddressObservable: AngularFireList<any>;
  couponData: AngularFireList<any>;
  constructor(private db: AngularFireDatabase, public http: Http) {
    this.authToken = localStorage.getItem('token');
    this.userId = localStorage.getItem('User_Id');
    this.newAddressObservable = db.list("users" + "/" + this.userId + "/" + "address");
    this.couponData = db.list("coupons");
  }

  getUserDetail() {
    return this.db.object("users" + "/" + this.userId);
  }

  getUserLoality() {
    return this.db.list("users" + "/" + this.userId + '/loyaltyPoints');
  }

  getLoyalityPercentage() {
    return this.db.object("/loyalitys");
  }

  // updateUserData(data, obj_id:any) {
  //   const body = JSON.stringify(data);
  //   return this.crud.put('users',body,obj_id).map((data:Response)=>data)
  //  }

  // updatePassword(data){
  // 	const body = JSON.stringify(data);
  // 	return this.crud.updatePassword(body).map((data:Response)=>data)  
  //  }

  saveAddress(data) {
    return this.newAddressObservable.push(data);
  }

  updateAddress(data, id) {
    return this.newAddressObservable.update(id, data);
  }

  placeOrder(data) {
    //const body = JSON.stringify(data);
    return this.db.list("orders").push(data);
  }

  getAllSavedAddress() {
    return this.newAddressObservable;
  }

  // deleteAddress(objId){
  //   return this.crud.delete('addresses',objId).map((data:Response)=>data);
  // }

  // getTaxData(){
  //    return this.crud.get('settings',true).map((data:Response)=>data);
  // }

  getCouponsData() {
    return this.couponData;
  }

  // updateAddressData(data,obj_id:any) {
  //  const body = JSON.stringify(data);
  //  return this.crud.put('addresses',body,obj_id).map((data:Response)=>data)
  // }

  chargeStripe(token, currency, amount, stripe_secret_key) {
    let secret_key = stripe_secret_key;
    console.log("--->>>>", token, currency, amount, stripe_secret_key)
    var headers = new Headers();
    var params = new URLSearchParams();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + secret_key);
    params.append("currency", currency);
    params.append("amount", amount);
    params.append("description", "description");
    params.append("source", token);
    return new Promise(resolve => {
      this.http.post('https://api.stripe.com/v1/charges', params, {
        headers: headers
      }).map(res => res.json())
        .subscribe(data => {
          console.log("Response data" + JSON.stringify(data))
          resolve(data);
        }, error => {
          console.log(error)
        });
    });
  }

  // send stripe card detail

  sendCardDetail(data: any) {
    console.log("card data" + JSON.stringify(data));
    const body = JSON.stringify(data);
    const headers = new Headers();
    return this.http.post('https://checkout.stripe.com/checkout.js', body, {
      headers: headers
    })
      .map((data) => data);
  }

  processPayment(token: any, amount) {
    var payment = { token, amount };
    return this.db.list(`/payments/${this.userId}`).push(payment);
  }

  //stripe payment
  // stripePayment(amount:any,stripeToken:any){
  //     const body:any = {
  //       amount:amount,
  //       customerId:stripeToken
  //     };      
  //     return this.crud.post('users/stripe/payment', body).map((data: Response) => data);
  // }
  //Update Order Status after payment
  updateOrder(orderId: any, order: any) {
    return this.db.object("orders" + "/" + orderId).update(order);
  }

  // get saved dard list

  // getSavedCardList(){
  //     return this.crud.get('carddetails/user',true).map((data:Response)=>data);
  //  }
}
