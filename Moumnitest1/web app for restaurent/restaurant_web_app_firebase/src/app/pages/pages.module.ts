import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MenuListComponent } from './menu-list/menu-list.component';
import { AllProductComponent } from './all-product/all-product.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { MDBBootstrapModule } from '../typescripts/free';
import { MDBBootstrapModulePro } from '../typescripts/pro';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AccountComponent } from './account/account.component';
import { MenuProductComponent } from './menu-product/menu-product.component';
import { RatingModule } from 'ng2-rating';
import { ShareButtonsModule } from 'ngx-sharebuttons';

import { AuthService } from './login/auth.service';
import { LoginService } from './login/login.service';
import { Page404Component } from './page404/page404.component';
import { BookedTableComponent } from './booked-table/booked-table.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PostComponent } from './post/post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { HttpModule } from '@angular/http';

import { OwlModule } from 'ng2-owl-carousel';

export const routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgetPass', component: ForgetPasswordComponent },
  { path: 'thanks', component: ThankYouComponent, canActivate: [AuthService] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthService] },
  { path: 'account', component: AccountComponent, canActivate: [AuthService] },
  { path: 'menu', component: MenuListComponent },
  { path: 'post', component: PostComponent },
  { path: 'post-detail/:id', component: PostDetailComponent },
  { path: 'booked-table', component: BookedTableComponent },
  { path: 'menu/products/:id', component: MenuProductComponent },
  { path: 'products', component: AllProductComponent },
  { path: 'products/:id', component: SingleProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthService] },
  { path: '**', component: Page404Component }
];


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    AngularMultiSelectModule,
    RouterModule.forChild(routes),
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModulePro.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule.forRoot(),
    RatingModule,
    NgxPaginationModule,
    OwlModule
  ],
  declarations:
    [
      LoginComponent,
      HomeComponent,
      MenuListComponent,
      AllProductComponent,
      SingleProductComponent,
      CartComponent,
      CheckoutComponent,
      SignupComponent,
      ForgetPasswordComponent,
      ThankYouComponent,
      OrderHistoryComponent,
      AccountComponent,
      MenuProductComponent,
      Page404Component,
      BookedTableComponent,
      WishlistComponent,
      AboutUsComponent,
      ContactUsComponent,
      PostComponent,
      PostDetailComponent
    ],
  providers: [AuthService, LoginService]
})
export class PagesModule { }
