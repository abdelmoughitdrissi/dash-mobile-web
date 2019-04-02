import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SingleProductService } from './single-product.service';
import swal from 'sweetalert2';
import { shareLink } from '../../firebase.config';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  providers: [SingleProductService]
})
export class SingleProductComponent implements OnInit {

  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public socialShareLink: string;
  public socialShareTitle: string;
  public socialShareImage: string;
  public currency: string = localStorage.getItem('currency');;
  public loading: number = 0;
  private menuItemId: any;
  public validReview: boolean = false;
  public menuItemData: any = {
    noOfRating: 0,
  };
  public variantArray: Array<any> = [];
  public extraIngredients: any = [];
  public selectedSize: any;
  public selectedQty: any;
  public totalPrice: any;
  public itemPrice: number;
  public sizeOption = {
    specialPrice: '',
    value: '',
    pname: ''
  };

  public cart: any = [];

  public maxRat: number = 5;
  public isReadonly: boolean = true;

  public allReviewsData: any[] = [];
  public userId: any;
  public isFavourite: boolean;
  public itemSize: string

  constructor(private route: ActivatedRoute,
    public router: Router,
    private restService: SingleProductService,
    private seo: SeoService) {

    if (localStorage.getItem('cart') != null) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.selectedQty = 1; //defalt qty 1 selected;
        this.menuItemId = Id;
        this.socialShareLink = shareLink + '/products/' + this.menuItemId;
        this.socialShareTitle = "Hello ionicfirebaseapp";
        this.socialShareImage = "http://res.cloudinary.com/pietechsolutions/image/upload/v1486575508/zz7hbotx11kmlzqq0tpp.jpg";
        this.getProductData();
        this.getItemRating();
        if (localStorage.getItem('User_Id') != null) {
          this.userId = localStorage.getItem('User_Id');
          this.checkFavourite();
        }
      }
    });

  }


  selectExtraIngredient(event, e) {
    if (e.target.checked === true) {
      this.totalPrice = this.totalPrice + event.value;
      this.selectedItems.push(event);
    } else {
      this.totalPrice = this.totalPrice - event.value;
      this.selectedItems.splice(event, 1);
    }
    // console.log(event);
  }
  getProductData() {
    let singleProduct = this.restService.getMenuItemData(this.menuItemId);
    singleProduct.valueChanges().subscribe(
      (response: any) => {
        this.extraIngredients = [];
        if (response.extraOptions) {
          response.extraOptions.forEach(data => {
            data.selected = false;
            this.extraIngredients.push(data);
          });
        }


        this.menuItemData = response;
        this.variantArray = this.menuItemData.price;
        this.seo.generateTags({
          title: response.title,
          description: response.description,
          image: response.thumb,
          slug: 'products/' + this.menuItemId
        })
        if (this.variantArray[0].specialPrice == undefined) {
          this.variantArray[0].specialPrice = this.variantArray[0].value;
          this.itemPrice = this.variantArray[0].specialPrice
        } else {
          this.itemPrice = this.variantArray[0].specialPrice;
        }
        this.totalPrice = this.variantArray[0].specialPrice * this.selectedQty;
        this.selectedSize = this.totalPrice;
        this.extraIngredients = this.menuItemData.extraOptions;
        this.sizeOption = this.variantArray[0];
        this.loading = 1;
      },
      () => {
        this.loading = 2;
      }
    );
  }

  getItemRating() {
    this.restService.getRatingData(this.menuItemId).valueChanges().subscribe((res) => {
      let data;
      this.allReviewsData = [];
      res.forEach(items => {
        data = items;

        for (var val of data.cart) {
          if (val.item.itemId === this.menuItemId) {
            this.validReview = true;
            this.allReviewsData.push(val);
          } else {
            this.validReview = false;
          }
        }
      });
    }, () => {
      this.allReviewsData = [];
      this.allReviewsData.length = 0;
    })
  }

  checkFavourite() {
    if (localStorage.getItem("User_Id") != null) {
      this.userId = localStorage.getItem("User_Id");
      this.restService.checkFavouritData(this.userId, this.menuItemId).valueChanges().subscribe(
        (res) => {
          if (res != null) {
            this.isFavourite = true;
          } else {
            this.isFavourite = false;
          }
        }, () => {
          this.isFavourite = false;
        }
      );
    }
  }

  onSelectSize(data) {
    var val = Number(data.target.value);
    var data = this.variantArray.find(data => {
      data.value = Number(data.value);
      return data.value === val
    })
    // console.log(data);
    this.itemSize = data.pname
    if (data.specialPrice === undefined) {
      this.selectedSize = data.value;
    } else {
      this.selectedSize = data.specialPrice
    }
    this.itemPrice = this.selectedSize;
    this.totalPrice = (this.selectedSize * this.selectedQty);
    this.sizeOption.specialPrice = this.selectedSize;
    this.sizeOption.value = data.value;
    this.sizeOption.pname = data.pname;
    // var cpn = val.split("+");
    // this.selectedSize = cpn[0];
    // this.totalPrice = (this.selectedSize*this.selectedQty);
    // this.sizeOption.specialPrice = cpn[0];
    // this.sizeOption.value = cpn[1];
    // this.sizeOption.pname = cpn[2];
  }

  onSelectQty(val) {
    this.selectedQty = val;
    this.totalPrice = (this.selectedSize * this.selectedQty);
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach(data => {
        let x = this.dropdownList.findIndex(value => data.id == value.id);
        this.totalPrice = this.dropdownList[x].value + this.totalPrice;
      });
    } else {
      this.totalPrice = (this.selectedSize * this.selectedQty);
    }
  }


  addToCart() {
    if (this.cart == null) {
      this.cart = [];
      let item: any = {
        itemTotalPrice: this.totalPrice,
        item: {
          itemId: this.menuItemId,
          itemQunatity: this.selectedQty,
          extraOptions: this.selectedItems,
          price: {
            pname: this.sizeOption.pname,
            value: this.selectedSize
          },
          title: this.menuItemData.title,
          thumb: this.menuItemData.thumb
        }
      };
      this.cart.push(item);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      swal({
        title: 'Added!!!',
        text: 'Food Item added to cart!...',
        background: '#fff',
        type: 'success',
        showConfirmButton: false,
        width: 300,
        timer: 1000
      }).then(() => {
      }, () => {
      });
    }
    else {
      var index = this.cart.findIndex(i => i.item.itemId === this.menuItemId);
      if (index >= 0) {
        this.cart.splice(index, 1);
        let item: any = {
          itemTotalPrice: this.totalPrice,
          item: {
            itemId: this.menuItemId,
            itemQunatity: this.selectedQty,
            extraOptions: this.selectedItems,
            price: {
              pname: this.sizeOption.pname,
              value: this.selectedSize
            },
            title: this.menuItemData.title,
            thumb: this.menuItemData.thumb
          }
        };
        this.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        swal({
          title: 'Updated!!!',
          text: 'Cart Item Updated!...',
          background: '#fff',
          type: 'success',
          showConfirmButton: false,
          width: 300,
          timer: 1000
        }).then(() => {
        }, () => {
        });
      } else {
        let item: any = {
          itemTotalPrice: this.totalPrice,
          item: {
            itemId: this.menuItemId,
            itemQunatity: this.selectedQty,
            extraOptions: this.selectedItems,
            price: {
              pname: this.sizeOption.pname,
              value: this.selectedSize
            },
            title: this.menuItemData.title,
            thumb: this.menuItemData.thumb
          }
        };
        this.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        swal({
          title: 'Added!!!',
          text: 'Food Item Added to cart!...',
          background: '#fff',
          type: 'success',
          showConfirmButton: false,
          width: 300,
          timer: 1000
        }).then(() => {
        }, () => {
        });
      }
    }
  }

  onAddToFavourit() {
    var body = {
      description: this.menuItemData.description,
      thumb: this.menuItemData.thumb,
      title: this.menuItemData.title
    }
    if (localStorage.getItem('User_Id') != null) {
      this.userId = localStorage.getItem("User_Id");
      this.restService.saveFavourit(this.menuItemId, this.userId, body).then(
        () => {
          this.isFavourite = true;
          swal({
            title: 'Cool',
            text: 'Added to favorites',
            background: '#fff',
            type: 'info',
            showConfirmButton: false,
            width: 300,
            timer: 1000
          }).then(
            function () {
            },
            function (dismiss) {
              if (dismiss === 'timer') {

              }
            }
          );
        }
      ).catch(
        () => {
          swal({
            title: 'Error',
            text: 'Sorry, could not add to favorites',
            background: '#fff',
            type: 'error',
            showConfirmButton: false,
            width: 300,
            timer: 2000
          }).then(() => {
          }, () => {
          });
        }
      )
    }
    else {
      this.isFavourite = false;
      swal({
        title: 'Opss!!!',
        text: 'Please login first...',
        background: '#fff',
        type: 'info',
        showConfirmButton: false,
        width: 300,
        timer: 1000
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

  removeFavourit() {
    if (localStorage.getItem('User_Id') != null) {
      this.restService.deleteFavouritData(this.userId, this.menuItemId).then(() => {
        this.isFavourite = false;
        swal({
          title: 'OOPs',
          text: 'removed favorites',
          background: '#fff',
          type: 'info',
          showConfirmButton: false,
          width: 300,
          timer: 1000
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
    else {
      swal({
        title: 'Opss!!!',
        text: 'Please login first...',
        background: '#fff',
        type: 'info',
        showConfirmButton: false,
        width: 300,
        timer: 1000
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

  ngOnInit() {
    this.selectedItems = [

    ];
    this.dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      text: "Select ExtraIngredient",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: "myclass custom-class"
    };
  }
  onItemSelect(item: any) {
    console.log(item);
    let x;
    console.log(this.selectedItems);
    this.selectedItems.forEach(data => {
      x = this.dropdownList.findIndex(value => data.id == value.id);

    });
    this.totalPrice = this.dropdownList[x].value + this.totalPrice;
  }
  OnItemDeSelect(item: any) {
    console.log('item', item);
    console.log(this.selectedItems);
    let x = this.dropdownList.findIndex(value => item.id == value.id);
    this.totalPrice = this.totalPrice - this.dropdownList[x].value;

  }


  slideImg = [
    { "img": "assets/img/product/food.jpg" },
    { "img": "assets/img/product/food2.jpg" },
    { "img": "assets/img/product/food3.jpg" },
    { "img": "assets/img/product/food4.jpg" },
    { "img": "assets/img/product/food5.jpg" },
    { "img": "assets/img/product/food6.jpg" },

  ];

  review = [
    {
      "img": "assets/img/profile/profile.jpg",
      "name": "Karissa jackson",
      "date": "Posted on August 30, 2017 12:12PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },
    {
      "img": "assets/img/profile/profile3.jpg",
      "name": "Emma  Watson",
      "date": "Posted on July 02, 2017 10:10PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },
    {
      "img": "assets/img/profile/profile.jpg",
      "name": "Karissa jackson",
      "date": "Posted on August 30, 2017 12:12PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },
    {
      "img": "assets/img/profile/profile3.jpg",
      "name": "Emma  Watson",
      "date": "Posted on July 02, 2017 10:10PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },
    {
      "img": "assets/img/profile/profile.jpg",
      "name": "Karissa jackson",
      "date": "Posted on August 30, 2017 12:12PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },
    {
      "img": "assets/img/profile/profile3.jpg",
      "name": "Emma  Watson",
      "date": "Posted on July 02, 2017 10:10PM",
      "comment": `
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,quis nostrud exercitation
              ullamco laboris nisi.
                    `,
    },

  ]
}
