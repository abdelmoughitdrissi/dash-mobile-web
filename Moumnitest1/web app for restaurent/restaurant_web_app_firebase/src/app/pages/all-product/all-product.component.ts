import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllProductsService } from './all-products.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-all-product',
    templateUrl: './all-product.component.html',
    styleUrls: ['./all-product.component.scss'],
    providers: [AllProductsService]
})
export class AllProductComponent implements OnInit {
    searchVisible = false;
    allItems: Array<any> = [];
    allItemsCopy: Array<any> = [];
    public maxRat: number = 5;
    public isReadonly: boolean = true;
    public p: number = 1;
    public loading: number = 0;
    public currency: string = localStorage.getItem('currency');

    constructor(private restService: AllProductsService, private router: Router) {
        this.getAllMenuItems();
    }

    getAllMenuItems() {
        let productItems = this.restService.getAllProducts();
        productItems.snapshotChanges().subscribe(
            (items) => {
                if (items.length > 0) {
                    this.allItems = [];
                    items.forEach(item => {
                        let itemData = item.payload.toJSON();
                        itemData['_id'] = item.payload.key;
                        this.allItems.push(itemData);
                        this.loading = 1;
                    });
                    this.allItemsCopy = this.allItems;
                } else {
                    this.loading = 2;
                }
            }, (error) => {
                JSON.stringify(error)
                swal({
                    title: 'Oops',
                    text: 'Could not get products',
                    background: '#fff',
                    type: 'error',
                    showConfirmButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
            }
        );
    }


    searchProducts(event) {
        let val = event.target.value;
        if (val && val.trim() != '') {
            this.allItems = this.allItems.filter((data) => {
                return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        } else {
            this.allItems = this.allItemsCopy;
            return this.allItems;
        }
    }

    search() {
        this.searchVisible = true;
    }

    viewItem(itemId) {
        this.router.navigate(['products/' + itemId]);//
    }

    ngOnInit() {
    }
}
