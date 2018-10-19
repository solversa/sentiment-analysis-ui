import { Injectable } from '@angular/core';
import * as SocketIO from 'socket.io-client';
import { Observable, Subject } from 'rxjs';


const serverURL = 'http://localhost:5001';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: SocketIOClient.Socket;
  private messagesToSend = [];

  private onMessageReceived: Observable<any>;
  private onMessageReceivedManager: Subject<any> = new Subject();


  constructor() {
    console.log('Inside WebsocketService constructor');

    this.onMessageReceived = this.onMessageReceivedManager.asObservable();

    this.connect();

    this.onMessageReceivedManager.subscribe((message) => {
      console.log(`Received message from server: ${message}`);
    });
  }

  public connect(): void {
    this.socket = SocketIO(serverURL);

    this.socket.on('connect_error', (err) => {
      console.log(`Socket had connect_error: ${err}`);
    });

    this.socket.on('connect_timeout', () => {
      console.log('Socket had connect_timeout error');
    });

    this.socket.on('reconnect', (attempts) => {
      console.log(`Socket reconnected successfully after ${attempts} attempts`);
    });

    this.socket.on('reconnect_error', (err) => {
      console.log(`Socket had a reconnect_error: ${err}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Socket had a reconnect_failed');
    });

    this.socket.on('connect', (event: Event) => {
      console.log(`Socket Connected! ${event}`);
    });

    this.socket.on('message', (data) => {
      this.onMessageReceivedManager.next({data: data});
    });

    this.socket.on('error', (err) => {
      console.log(`Socket had error: ${err}`);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  public send(message): void {
    if (this.socket.io.readyState === 'open') {
      if (message !== undefined) {
        console.log(`Sending message: ${message}`);
        this.socket.send();
      } else {
        console.log('Message was undefined when trying to send to websocket');
      }
    } else if (this.socket.io.readyState === 'opening') {
      this.messagesToSend.push(message);
    } else {
      console.log('Websocket was not open or opening');
    }
  }

  /* public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: any): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on(event, () => observer.next());
    });
  } */
}
