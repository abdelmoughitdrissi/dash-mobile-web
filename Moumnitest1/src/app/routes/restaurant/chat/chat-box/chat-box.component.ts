import { Component, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { userlist, chatData, showChat } from '../chat';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  // scrollTop = '';
  public chatList: Array<any>;
  username: any = '';
  chatMessage = {
    message: '',
    sendBy: 'Admin',
    userName: '',
    createdAt: Date.now()
  }
  public imageUrl: any;
  public chatData: any = [];
  messageId: Observable<string>;
  chatUserId: any;
  public isLoading: boolean = false;
  public user: any = {};
  constructor(public el: ElementRef,
    private routes: ActivatedRoute,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    private router: Router,
    public storeData: Store<showChat>) {

    this.messageList();
  }

  messageList() {
    this.messageId = this.storeData.select('data');
    this.messageId.subscribe(res => {
      if (res != '@ngrx/store/init') {
        this.chatUserId = res;
        this.db.object('/users/' + this.chatUserId).valueChanges().subscribe((res: any) => {

          if ((res.name != null) && (res.image != null)) {
            this.username = res.name;
            this.imageUrl = res.image
          }
        })

        this.db.object('/messages/' + this.chatUserId).valueChanges().subscribe(res => {

          this.db.list('/messages/' + this.chatUserId).valueChanges().subscribe(response => {
            setTimeout(() => {
              this.scrollToBottom();
            });
            this.chatData = response;
          })

        })
      }
    })
  }



  ngOnInit() { }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {

    }
  }

  //  scrollToBottom() {
  //   let scrollPane: any = this.el
  //     .nativeElement.querySelector('.msg-container-base');      
  //   scrollPane.scrollTop = scrollPane.scrollHeight;
  // }


  //send Message
  sendMessage(form: NgForm) {
    this.db.list('/messages/' + this.chatUserId).push(this.chatMessage).then(res => {
      this.chatMessage = {
        message: '',
        sendBy: 'Admin',
        userName: 'Admin',
        createdAt: Date.now()
      }
    })
  }
}
