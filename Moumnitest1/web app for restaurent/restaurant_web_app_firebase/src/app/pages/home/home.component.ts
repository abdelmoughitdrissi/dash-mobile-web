import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import swal from 'sweetalert2';
import { IMyOptions } from '../../typescripts/pro/date-picker/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  public recentCategoryData: Array<any> = [];
  myDatePickerOptions: IMyOptions;
  selectedDate: any = null;
  selectedTime: any = null;
  person: number = 0;
  minDate: any;
  public currency: string = localStorage.getItem('currency');
  bookTable: any = {
    userID: null,
    time: null,
    date: null,
    person: 0,
    status: 'Pending',
  };
  public responseArray: any[] = [];
  public recentTestimonialData: any[] = [];
  public maxRat: number = 5;
  public isReadonly: boolean = true;

  constructor(private restService: HomeService, private router: Router, ) {
    this.getRecentCategory();
    this.getProductList();
    this.getRecentTestimonial();
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();

    this.myDatePickerOptions = {
      disableUntil: { year: year, month: month, day: date - 1 }
    }
  }

  // contactData(){
  //   this.restService.getContactsData().subscribe((res)=>{
  //   })
  //}

  onSelectPerson(event) {
    this.bookTable.person = event.target.value;
    console.log(this.bookTable.person);
  }

  onBookTable() {
    this.bookTable.userID = localStorage.getItem('User_Id');
    if (localStorage.getItem('auth')) {
      this.restService.bookTable(this.bookTable).then(
        () => {
          this.bookTable.date = null;
          this.bookTable.time = null;
          this.bookTable.person = null;
          swal({
            title: 'Table Booked!!',
            text: 'Thanks for booking',
            background: '#fff',
            type: 'success',
            showConfirmButton: false,
            width: 300,
            timer: 2000
          }).then(() => {
          }, () => {
          });

        }, () => {
          swal({
            title: 'Oops!!',
            text: 'Could not book the table',
            background: '#fff',
            type: 'error',
            showConfirmButton: false,
            width: 300,
            timer: 2000
          }).then(() => {
          }, () => {
          });
        });
    } else {
      swal({
        title: 'Oops!!!',
        text: 'Please Login',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 1000
      }).then(() => {
      }, () => {
      });
    }
  }

  getRecentCategory() {
    this.restService.getRecentCategoryData().snapshotChanges().subscribe((res) => {
      this.recentCategoryData = [];
      res.forEach(categoryData => {
        let categoryValues = categoryData.payload.toJSON();
        categoryValues['_id'] = categoryData.payload.key;
        this.recentCategoryData.push(categoryValues);
      });
    }, () => {
      swal({
        title: 'Oops',
        text: 'Could not get category data',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(() => {
      }, () => {
      });
    });
  }

  getRecentTestimonial() {
    this.restService.getRecentTestimonialData().snapshotChanges().subscribe((res) => {
      this.recentTestimonialData = [];
      res.forEach(testimonialData => {
        let productVal = testimonialData.payload.toJSON();
        productVal['_id'] = testimonialData.payload.key;
        this.recentTestimonialData.push(productVal);
      });
    }, () => {
      swal({
        title: 'Oops',
        text: 'Could not get Testimonial data',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(() => {
      }, () => {
      });
    });
  }

  gotoMenuItems(menuId) {
    this.router.navigate(['menu/products/' + menuId]);
  }

  getProductList() {
    this.restService.getProductData().snapshotChanges().subscribe(
      (res) => {
        this.responseArray = [];
        res.forEach(productData => {
          let productVal = productData.payload.toJSON();
          productVal['_id'] = productData.payload.key;
          this.responseArray.push(productVal);
        });
      }
    );
  }

  goToSingleProduct(id) {
    this.router.navigate(['products' + '/' + id]);
  }

  ngOnInit() {
  }

  offerList = [
    {
      'img': 'assets/img/product/food.jpg',
      'title': 'Fresh Biryani',
      'price': '$34',
      'offPrice': '$50'
    },
    {
      'img': 'assets/img/product/food2.jpg',
      'title': 'Fresh chicken',
      'price': '$89',
      'offPrice': '$99'
    },
    {
      'img': 'assets/img/product/food3.jpg',
      'title': 'Fresh Mashroom',
      'price': '$104',
      'offPrice': '$100'
    },
    {
      'img': 'assets/img/product/food4.jpg',
      'title': 'Full Thali',
      'price': '$54',
      'offPrice': '$90'
    },

  ];
  offerList2 = [
    {
      'img': 'assets/img/product/food5.jpg',
      'title': 'Puri and curry',
      'price': '$54',
      'offPrice': '$90'
    },

    {
      'img': 'assets/img/product/food6.jpg',
      'title': 'Fresh Samosa',
      'price': '$34',
      'offPrice': '$50'
    },
    {
      'img': 'assets/img/product/food7.jpg',
      'title': 'Cheese Paratha',
      'price': '$89',
      'offPrice': '$99'
    },
    {
      'img': 'assets/img/product/food8.jpg',
      'title': 'Fresh Mutton',
      'price': '$104',
      'offPrice': '$100'
    },
  ];

  menu = [
    {
      'img': 'assets/img/product/food5.jpg',
      'title': 'Puri and curry',
      'price': '$54',
      'details': `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
            `,
    },

    {
      'img': 'assets/img/product/food6.jpg',
      'title': 'Fresh Samosa',
      'price': '$34',
      'details': `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      'img': 'assets/img/product/food7.jpg',
      'title': 'Cheese Paratha',
      'price': '$89',
      'details': `
            Lorem ipsum dolor sit amet, consectetur amet, consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
            `,
    },
    {
      'img': 'assets/img/product/food8.jpg',
      'title': 'Fresh Mutton',
      'price': '$104',
      'details': `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      'img': 'assets/img/product/food9.jpg',
      'title': 'Puri and curry',
      'price': '$54',
      'details': `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmodadipisicing elit, sed do eiusmod
            `,
    },

    {
      'img': 'assets/img/product/food2.jpg',
      'title': 'Fresh Samosa',
      'price': '$34',
      'details': `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      'img': 'assets/img/product/food3.jpg',
      'title': 'Cheese Paratha',
      'price': '$89',
      'details': `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            `,
    },
    {
      'img': 'assets/img/product/food4.jpg',
      'title': 'Fresh Mutton',
      'price': '$104',
      'details': `
            Lorem ipsum dolor sit amet, consectetur  amet, consectetur adipisicing elit, sed do eiusmodadipisicing elit, sed do eiusmod
            `,
    },

  ];

  review1 = [
    {
      'img': 'assets/img/profile/profile2.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'John Michel',
      'post': 'Food Panda'
    },
    {
      'img': 'assets/img/profile/profile3.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'Jesica Danial',
      'post': 'FoodPanda'
    },
    {
      'img': 'assets/img/profile/profile5.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'Tom Cruise',
      'post': 'KFC'
    },

  ];
  review2 = [

    {
      'img': 'assets/img/profile/profile5.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'Tom Cruise',
      'post': 'KFC'
    },
    {
      'img': 'assets/img/profile/profile2.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'John Michel',
      'post': 'Food Panda'
    },
    {
      'img': 'assets/img/profile/profile3.jpg',
      'comment': `
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident,
            `,
      'name': 'Jesica Danial',
      'post': 'FoodPanda'
    },

  ];


}
