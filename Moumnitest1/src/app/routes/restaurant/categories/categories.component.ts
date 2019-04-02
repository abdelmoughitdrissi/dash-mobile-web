import { Component, OnInit } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
// import  {map} from 'rxjs/Operator/map';

import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
const swal = require('sweetalert');

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public siteVal: any;
  public categories: any[] = [];
  public catRef: AngularFireList<any>;
  public categoryData: Observable<any>;

  constructor(public af: AngularFireDatabase,
    public router: Router,
    public toastr: ToastrService) {

    this.catRef = this.af.list('/categories');
    this.categoryData = this.catRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.categoryData.subscribe((res) => {
      this.categories = res;
    });
  }



  getCategory(ev: any) {
    let val = ev;
    this.categoryData = this.af.list('/categories', ref => ref.orderByChild('title').startAt(val.charAt(0).toUpperCase() + val.slice(1))
      .endAt(val.charAt(0).toUpperCase() + val.slice(1) + '\uf8ff')).valueChanges();
    this.categoryData
      .subscribe((data) => {
        this.categories = data;
      });


  }


  categoryShow(key) {
    this.router.navigate(['/categories/viewCategory', key]);
  }

  categoryEdit(key) {
    this.router.navigate(['/categories/editCategory', key]);
  }

  categoryDelete(key: any) {
    swal({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce fichier ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui, Supprimer Le!',
      cancelButtonText: 'No, Annuler!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.catRef.remove(key).then(resp => {
          swal('Supprimer!', 'Categories Data Supprimer Avec succès!', 'success');
        })
      } else {
        swal('Annuler', 'Votre data est Sauvgarder :)', 'error');
      }
    });
  }

  ngOnInit() {

  }
}
