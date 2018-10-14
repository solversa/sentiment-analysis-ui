import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private title: String = 'sentiment-analysis';
  searchText: String;
  items: Array<object>;

  constructor(private http: HttpClient) {
    this.items = [
      {
        'id': 'title1',
        'title': 'Title 1',
        'description': 'Description 1'
      },
      {
        'id': 'title2',
        'title': 'Title 2',
        'description': 'Description 2'
      },
      {
        'id': 'title3',
        'title': 'Title 3',
        'description': 'Description 3'
      }
    ];
  }

  getData() {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    this.http.get(`http://127.0.0.1:5000/user/${this.searchText}/10`, {headers})
    .subscribe((res) => {
      console.log('Got the Response');
      console.log(res);
    });
  }
}
