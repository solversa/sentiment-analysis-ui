import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'sentiment-analysis';
  public searchText: string;
  public items: Array<{id: string, title: string, description: string, show: string}>;

  constructor(private http: HttpClient) {
    this.items = [
      /* {
        'id': 'title1',
        'title': 'Title 1',
        'description': 'Description 1',
        'show': ''
      },
      {
        'id': 'title2',
        'title': 'Title 2',
        'description': 'Description 2',
        'show': ''
      },
      {
        'id': 'title3',
        'title': 'Title 3',
        'description': 'Description 3',
        'show': ''
      } */
    ];
  }

  getData() {
    this.items = [];
    const headers = new HttpHeaders({
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    this.http.get(`http://127.0.0.1:5000/user/${this.searchText}/10`, {headers})
    .subscribe((res: any) => {
      console.log('Got the Response');
      // console.log(res);
      const tweets = res.Tweets;
      let count = 1;
      tweets.forEach(e => {
        this.items.push({
          id: 'title' + count,
          title: e.name,
          description: e.data,
          show: ''
        });
        count += 1;
      });
    });
  }

  public toggleCollapse(id: string) {
    const item = this.items.find(p => p.id === id);
    if (item) {
      if (item.show === 'show') {
        item.show = '';
      } else {
        item.show = 'show';
      }
    }
  }
}
