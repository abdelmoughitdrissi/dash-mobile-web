import { Component, OnInit } from '@angular/core';
import { MenuListService } from './menu-list.service';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
  providers: [MenuListService]
})
export class MenuListComponent implements OnInit {

  menusData: Array<any> = [];
  public loading: number = 0;
  p: number = 1;
  constructor(private restService: MenuListService, public router: Router, private toastr: ToastrService) {
    this.getAllMenus();
  }

  getAllMenus() {
    let categoryData = this.restService.getAllMenus();
    categoryData.snapshotChanges().subscribe(
      (items) => {
        if (items.length > 0) {
          this.menusData = [];
          items.forEach(item => {
            let itemVal = item.payload.toJSON();
            itemVal["_id"] = item.payload.key;
            this.menusData.push(itemVal);
            this.loading = 1;
          });
        } else {
          this.loading = 2;
        }
      }, (error) => {
        this.toastr.error("OOPS", error.message);
      }
    );
  }

  exploreMenu(menuId) {
    this.router.navigate(['menu/products/' + menuId]);
  }

  ngOnInit() {
  }

  menu = [
    {
      "img": "assets/img/product/food5.jpg",
      "title": "Puri and curry",
      "price": "$54",
      "details": `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
            `,
    },

    {
      "img": "assets/img/product/food6.jpg",
      "title": "Fresh Samosa",
      "price": "$34",
      "details": `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      "img": "assets/img/product/food7.jpg",
      "title": "Cheese Paratha",
      "price": "$89",
      "details": `
            Lorem ipsum dolor sit amet, consectetur amet, consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
            `,
    },
    {
      "img": "assets/img/product/food8.jpg",
      "title": "Fresh Mutton",
      "price": "$104",
      "details": `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      "img": "assets/img/product/food9.jpg",
      "title": "Puri and curry",
      "price": "$54",
      "details": `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmodadipisicing elit, sed do eiusmod
            `,
    },

    {
      "img": "assets/img/product/food2.jpg",
      "title": "Fresh Samosa",
      "price": "$34",
      "details": `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      "img": "assets/img/product/food3.jpg",
      "title": "Cheese Paratha",
      "price": "$89",
      "details": `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      "img": "assets/img/product/food4.jpg",
      "title": "Fresh Mutton",
      "price": "$104",
      "details": `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmodadipisicing elit, sed do eiusmod
            `,
    },

  ];

}
