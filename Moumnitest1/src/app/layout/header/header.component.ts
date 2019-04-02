import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { userlist, chatData, showChat } from '../../../app/routes/restaurant/chat/chat';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
declare var $: any;

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { HeadersService } from './headers.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [HeadersService]
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout
    notificationData = [];
    isNavSearchVisible: boolean;
    public messageId: any;
    public chatUserId: any;
    public message: string;
    public sender: string;
    public countMessage: number;
    public userName: '';
    private orderCount: number = 0;
    @ViewChild('fsbutton') fsbutton;  // the fullscreen button
    ordersDataRef: AngularFireList<any>;
    public imageLogo: string = '';
    public imageIcon: string = '';
    constructor(private router: Router,
        public menu: MenuService,
        public userblockService: UserblockService,
        public settings: SettingsService,
        public af: AngularFireDatabase,
        public headersService: HeadersService,
        public storeData: Store<showChat>,
        public db: AngularFireDatabase, ) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
        db.list('/messages/', ref => ref.limitToFirst(1)).snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }).subscribe(response => {

            if (response.length > 0) {

                this.storeData.dispatch({ type: response[0].key });
                this.messageList();
            }

        })

        this.ordersDataRef = af.list('/orders');
        this.getHeaderImageAndLogo();

    }

    messageList() {

        this.messageId = this.storeData.select('data');


        this.countMessage = 0;
        this.messageId.subscribe(res => {
            if (res != '@ngrx/store/init') {
                this.chatUserId = res;

                this.db.list('/messages/' + this.chatUserId, ref => ref.limitToLast(4)).valueChanges()
                    .subscribe((response: any) => {

                        this.countMessage = 1;
                        if (this.countMessage == 1) {

                            this.message = response[0].message;
                            this.userName = response[0].userName;
                        }
                    })
            }
        })
    }

    getHeaderImageAndLogo() {
        this.af.object('settings').valueChanges().subscribe((res: any) => {
            if (res) {
                if (res.imageLogo != null) {
                    this.imageLogo = res.imageLogo;
                } else {
                    this.imageLogo = 'assets/img/logo.png';
                }
                if (res.imageIcon != null) {
                    this.imageIcon = res.imageIcon;
                } else {
                    this.imageIcon = 'assets/img/icon-small.png';
                }
            } else {
                this.imageLogo = 'assets/img/logo.png';
                this.imageIcon = 'assets/img/icon-small.png';
            }
        })
    }


    ngOnInit() {
        this.isNavSearchVisible = false;
        if (browser.msie) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }
        var count = 0;
        this.af.list('/orders', ref => ref.orderByChild('orderView').equalTo(false)
        ).snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }).subscribe((res: any) => {
            this.notificationData = [];
            count = res.length;
            for (let i = 0; i < count; i++) {
                this.notificationData.push({ name: res[i].userDetails.name, key: res[i].key })
            }
            if (count > this.orderCount) {
                this.playAudio();

                var message = {
                    // app_id: "ace5d8a2-5018-4523-ab21-cff285d32524",
                    app_id: "9740a50f-587f-4853-821f-58252d998399",
                    contents: { "en": "A New order Arrived" },
                    include_player_ids: [localStorage.getItem('playerId')]
                };

                this.headersService.sendNotification(message).subscribe(response => {

                });
            }

            this.orderCount = count;

        })

    }

    logout() {
        localStorage.removeItem('uid');

        this.router.navigate(['/login']);
    }

    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
    }

    openNavSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setNavSearchVisible(true);
    }

    setNavSearchVisible(stat: boolean) {
        this.isNavSearchVisible = stat;
    }

    getNavSearchVisible() {
        return this.isNavSearchVisible;
    }

    toggleOffsidebar() {
        this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
    }

    toggleCollapsedSideabar() {
        this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
    }

    isCollapsedText() {
        return this.settings.layout.isCollapsedText;
    }

    toggleFullScreen(event) {

        if (screenfull.enabled) {
            screenfull.toggle();
        }
        // Switch icon indicator
        let el = $(this.fsbutton.nativeElement);
        if (screenfull.isFullscreen) {
            el.children('em').removeClass('fa-expand').addClass('fa-compress');
        }
        else {
            el.children('em').removeClass('fa-compress').addClass('fa-expand');
        }

    }

    //go To View OrderPage
    goToViewOrderPage(id) {
        this.ordersDataRef.update(id, { orderView: true }).then((res) => {
            this.router.navigate(['/order/viewOrder', id]);
        });
    }

    goToViewChatPage() {
        this.router.navigate(['/chat']);
    }

    playAudio() {
        let audio = new Audio();
        audio.src = "assets/sound/sound.mp3";
        audio.load();
        audio.play();
    }
}
