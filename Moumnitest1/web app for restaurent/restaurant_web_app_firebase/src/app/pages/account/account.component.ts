import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from './account.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    providers: [AccountService]
})
export class AccountComponent implements OnInit {
    @ViewChild('a') a: NgForm;
    @ViewChild('u') u: NgForm;
    @ViewChild('closeUpdateAddressModal') closeUpdateAddressModal: ElementRef;
    editAddress1 = true;
    editAddress2 = false;
    addAddress = false;

    editInfo = false;
    editPassword = false
    public userDetails: any = {};
    public newAddress: any = {};
    public editUserDetails: any = {
        name: '',
        email: '',
        phone: Number
    };

    updatePassword: any = {
        email: '',
    }

    private updateAddressId: any;
    public updateAddressData: any = {};

    public savedAddresses: Array<any> = [];

    constructor(private restService: AccountService) {
        this.getUserInformation();
        this.getUserAddresses();
    }

    getUserInformation() {
        this.restService.getUserDetail().valueChanges().subscribe(
            (res) => {
                this.userDetails = res;
            }, (error) => {
                JSON.stringify(error);
                swal({
                    title: 'Oops',
                    text: 'Could not get users details',
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

    getUserAddresses() {
        this.restService.getAllSavedAddress().snapshotChanges().subscribe(
            (res) => {
                this.savedAddresses = [];
                res.forEach(items => {
                    let item = items.payload.toJSON();
                    item['_id'] = items.payload.key;
                    this.savedAddresses.push(item);
                })
            }, (error) => {
                JSON.stringify(error);
                swal({
                    title: 'Oops',
                    text: 'Could not get users addresses',
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

    editPasswordShow() {
        this.editInfo = false;
        this.editPassword = true;
    }

    onUpdatePassword(ngform: NgForm) {
        this.restService.updatePassword(ngform.value.email).then(
            () => {
                swal({
                    title: 'Great',
                    text: 'Update password link has send to your email',
                    background: '#fff',
                    type: 'success',
                    showCancelButton: false,
                    width: 300,
                    timer: 4000
                }).then(() => {
                }, () => {
                });
                this.hideForm();
            }
        ).catch(
            (error) => {
                swal({
                    title: 'Oops!!',
                    text: error.message,
                    background: '#fff',
                    type: 'error',
                    showCancelButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
            }
        );
    }

    editInfoShow() {
        this.editInfo = true;
        this.editPassword = false;
        this.editUserDetails = this.userDetails;
    }

    onUpdateUserInfo(ngForm: NgForm) {
        this.restService.updateUserData(ngForm.value).then(
            () => {
                swal({
                    title: 'Cool',
                    text: 'User Information updated successfully',
                    background: '#fff',
                    type: 'success',
                    showCancelButton: false,
                    showConfirmButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
                this.getUserInformation();
                this.hideForm();
            }
        ).catch(
            (error) => {
                swal({
                    title: 'Oops!!',
                    text: error.message,
                    background: '#fff',
                    type: 'error',
                    showCancelButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
            }
        );
    }

    ngOnInit() {
    }

    getSingleAddressData(index, obj_id) {
        this.updateAddressId = obj_id;
        this.updateAddressData = this.savedAddresses[index];
    }

    onUpdateAddress(ngform: NgForm) {
        this.restService.updateAddressData(ngform.value, this.updateAddressId).then(
            () => {
                swal({
                    title: 'Cool',
                    text: 'Address Updated Successfully',
                    background: '#fff',
                    type: 'success',
                    showConfirmButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
                this.closeUpdateAddressModal.nativeElement.click();
                this.getUserAddresses();
            }).catch(
                (error) => {
                    JSON.stringify(error);
                    swal({
                        title: 'Oops!!!',
                        text: 'Could not update the address',
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

    editAddressShow() {
        this.editAddress1 = true;
        this.editAddress2 = false;
        this.addAddress = false;
    }

    editAddressShow2() {
        this.editAddress1 = false;
        this.editAddress2 = true;
        this.addAddress = false;
    }

    addAddressShow() {
        this.addAddress = true;
        this.editAddress1 = false;
        this.editAddress2 = false;
    }

    onSaveNewAddress(ngform: NgForm) {
        this.restService.saveAddress(ngform.value).then(
            () => {
                swal({
                    title: 'Cool!!',
                    text: 'Address added successfully',
                    background: '#fff',
                    type: 'success',
                    showConfirmButton: false,
                    width: 300,
                    timer: 1500
                }).then(() => {
                }, () => {
                });
                this.getUserAddresses();
                this.a.reset();
            });
    }

    deleteAddress(_id) {
        swal({
            title: 'Are you sure',
            text: 'This address will be deleted permanantly',
            background: '#fff',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Delete it',
            cancelButtonText: 'No, Cancel',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(
            function () {
                this.restService.deleteAddress(_id).then(
                    () => {
                        swal({
                            title: 'Deleted',
                            text: 'Address has been successfully deleted',
                            background: '#fff',
                            type: 'success',
                            width: 300,
                            timer: 2000
                        }).then(() => {
                        }, () => {
                        });
                        this.getUserAddresses();
                    }).catch(
                        (error) => {
                            JSON.stringify(error);
                            swal({
                                title: 'Oops',
                                text: 'Could not delete the address',
                                background: '#fff',
                                type: 'error',
                                width: 300,
                                timer: 2000
                            }).then(() => {
                            }, () => {
                            });
                        });
            }.bind(this), function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(
                        'canceled',
                        'Your address is not deleted'
                    );
                }
            }
        );
    }

    hideForm() {
        this.editInfo = false;
        this.editPassword = false;
        this.addAddress = false;
    }
}
