import { ToastModule } from './typescripts/pro/alerts/toast/toast.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MDBBootstrapModule } from './typescripts/free';
import { MDBBootstrapModulePro } from './typescripts/pro/index';
//import { AgmCoreModule } from '@agm/core';
import { AngularFireModule } from'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBSpinningPreloader } from './typescripts/pro/index';

import { ShareButtonsModule } from 'ngx-sharebuttons';

//import {RouterModule} from'@angular/router';
import { Routing } from "./app.routing";
import { RatingModule } from 'ng2-rating';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import  { PagesModule }  from './pages/pages.module';

import { firebaseConfig } from './firebase.config';
import { SeoService } from './seo.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    PagesModule,
    RatingModule,
    HttpClientModule, // (Required) for share counts
    HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts
    ShareButtonsModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModulePro.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    CookieModule.forRoot(),
    NgbModule.forRoot(),
    Routing,
    // AgmCoreModule.forRoot({
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
    //   apiKey: 'Your_api_key'
    // }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [MDBSpinningPreloader, SeoService, AngularFireAuth, AngularFireDatabase],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
