import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { cloudinarUpload } from '../../../firebase.config';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public settings: any = {
    totalVat: 0,
    totalTables: 0,
    imageLogo: '',
    imageIcon: '',
    currency: {}
  };

  public imageLogo = 'assets/img/logo.png';
  public imageIcon = 'assets/img/icon-small.png';
  public iconSelected: boolean = false;
  public logoSelected: boolean = false;
  public isNewImageSelected: boolean = false;
  public isNewIconSelected: boolean = false;
  private isFirstTime: boolean = false;

  public currencyList: any[] = [];
  private settingDataRef: AngularFireObject<any>;
  private currencyDataRef: AngularFireList<any>;
  private settingObservable: Observable<any>;
  private currencyObservable: Observable<any>;
  public selectedCurrency: any;
  private currency: any = {
    currencyId: '',
    currencyName: '',
    currencySymbol: ''
  }

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(cloudinarUpload)
  );

  constructor(public af: AngularFireDatabase, public toastr: ToastrService) {
    this.settingDataRef = af.object('/settings');
    this.settingObservable = this.settingDataRef.valueChanges();
    this.settingObservable.subscribe((res: any) => {
      if (res) {
        this.settings = res;
        if (res.currency) {
          this.currency = res.currency;
          this.settings.currency = res.currency;
          this.selectedCurrency = res.currency.currencyId;
        }
        if (res.imageLogo != null) {
          this.settings.imageLogo = res.imageLogo;
          this.imageLogo = res.imageLogo;
        }
        if (res.imageIcon != null) {
          this.settings.imageIcon = res.imageIcon;
          this.imageIcon = res.imageIcon;
        }
      }
    });
    this.getCurrencyList();
  }

  getCurrencyList() {
    this.currencyDataRef = this.af.list('/currency');
    this.currencyObservable = this.currencyDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.currencyObservable.subscribe((res: any) => {
      if (res.length > 0) {
        this.currencyList = res;
      } else {
        this.currencyList = [];
      }
    });
  }

  onSelectCurrency(event) {

    const id = event.target.value;
    const index = this.currencyList.findIndex(x => x.key == id);
    this.currency.currencyId = this.currencyList[index].key;
    this.currency.currencyName = this.currencyList[index].currencyName;
    this.currency.currencySymbol = this.currencyList[index].currencySign.symbol;
  }


  //Image Preview

  readUrl(event, value) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        if (value == 1) {
          this.imageLogo = event.target.result;
          this.isNewImageSelected = true;
        } else {
          this.imageIcon = event.target.result;
          this.isNewIconSelected = true;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUpload(value) {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      if (value == 1) {
        this.logoSelected = true;
        this.settings.imageLogo = res.secure_url;
        this.isNewImageSelected = false;

      }
      if (value == 2) {
        this.iconSelected = true;
        this.settings.imageIcon = res.secure_url;
        this.isNewIconSelected = false;
      }

    }
  }

  onSubmitSetting(form: NgForm) {
    if (this.logoSelected || this.iconSelected) {
      this.settingDataRef.set({
        totalVat: this.settings.totalVat,
        totalTables: this.settings.totalTables,
        currency: this.currency,
        imageLogo: this.settings.imageLogo,
        imageIcon: this.settings.imageIcon
      }).then((res) => {
        this.toastr.success('Settings updated Successfully!', 'Success!');
      });
    } else {
      this.settingDataRef.set({
        totalVat: this.settings.totalVat,
        totalTables: this.settings.totalTables,
        currency: this.currency
      }).then((res) => {
        this.toastr.success('Settings updated Successfully!', 'Success!');
      });
    }
  }
}