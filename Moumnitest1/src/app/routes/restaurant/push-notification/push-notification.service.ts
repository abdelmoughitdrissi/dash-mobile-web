import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";

@Injectable()
export class PushNotificationService {

  url: any = 'https://onesignal.com/api/v1/notifications';


  constructor(private http: Http) {
  }

  sendNotification(message) {
    const body = JSON.stringify(message);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // copy your Rest api key below ;
    headers.append('Authorization', 'Basic YjNmZDA0MGUtZGZhNy00YmVjLWE5ZjAtZDdkZTExN2E1NWVl');
    return this.http.post(this.url, body, {
      headers: headers
    }).map((data: Response) => data.json())

  }
}
