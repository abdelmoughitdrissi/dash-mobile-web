import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MenuProductService } from './menu-product.service';
import { MenuListService } from '../menu-list/menu-list.service';
@Component({
  selector: 'app-menu-product',
  templateUrl: './menu-product.component.html',
  styleUrls: ['./menu-product.component.scss'],
  providers: [MenuProductService, MenuListService]
})
export class MenuProductComponent implements OnInit {

  private menuId: any;
  public loading: number = 0;
  public menuItems: Array<any> = [];
  public menuName: any = {};
  p: number = 1;
  public maxRat: number = 5;
  public isReadonly: boolean = true;
  public currency: string = localStorage.getItem('currency');
  constructor(private route: ActivatedRoute, public router: Router, private restService: MenuProductService) {
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.menuId = Id;
        this.getMenuItems();
      }
    });
    this.getCategoryName(this.menuId);
  }
  getCategoryName(id) {
    this.restService.getCategoryDetails(id).valueChanges().subscribe(
      (res) => {
        this.menuName = res;
      }
    );
  }

  getMenuItems() {
    let menuProductData = this.restService.getProductsData(this.menuId);
    menuProductData.snapshotChanges().subscribe(
      (response) => {
        if (response.length > 0) {
          this.menuItems = [];
          response.forEach(item => {
            let itemVal = item.payload.toJSON();
            itemVal["_id"] = item.payload.key;
            this.menuItems.push(itemVal);
            this.loading = 1;
          });
        } else {
          this.loading = 2;
        }
      }, () => {
        this.loading = 2;
      }
    )
  }

  viewItem(itemId) {
    this.router.navigate(['products/' + itemId]);//
  }


  ngOnInit() {
  }
  offerList = [
    {
      "img": "assets/img/product/food.jpg",
      "offer": "- 50%",
      "title": "Fresh Biryani",
      "price": "$34",
      "offPrice": "$50"
    },
    {
      "img": "assets/img/product/food2.jpg",
      "title": "Fresh chicken",
      "price": "$89",
      "offPrice": "$99"
    },
    {
      "img": "assets/img/product/food3.jpg",
      "title": "Fresh Mashroom",
      "price": "$104",
      "offPrice": "$100"
    },
    {
      "img": "assets/img/product/food4.jpg",
      "offer": "new",
      "title": "Full Thali",
      "price": "$54",
      "offPrice": "$90"
    },
    {
      "img": "assets/img/product/food5.jpg",
      "title": "Puri and curry",
      "price": "$54",
      "offPrice": "$90"
    },
    {
      "img": "assets/img/product/food6.jpg",
      "offer": "- 40%",
      "title": "Fresh Samosa",
      "price": "$34",
      "offPrice": "$50"
    },
    {
      "img": "assets/img/product/food7.jpg",
      "title": "Cheese Paratha",
      "price": "$89",
      "offPrice": "$99"
    },
    {
      "img": "assets/img/product/food8.jpg",
      "title": "Fresh Mutton",
      "price": "$104",
      "offPrice": "$100"
    },
    {
      "img": "assets/img/product/food3.jpg",
      "offer": "new",
      "title": "Fresh Mashroom",
      "price": "$104",
      "offPrice": "$100"
    },
    {
      "img": "assets/img/product/food4.jpg",
      "title": "Full Thali",
      "price": "$54",
      "offPrice": "$90"
    },
    {
      "img": "assets/img/product/food5.jpg",
      "title": "Puri and curry",
      "price": "$54",
      "offPrice": "$90"
    },
    {
      "img": "assets/img/product/food6.jpg",
      "offer": "- 70%",
      "title": "Fresh Samosa",
      "price": "$34",
      "offPrice": "$50"
    },

  ];
}
