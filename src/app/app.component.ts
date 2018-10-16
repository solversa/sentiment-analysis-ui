import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'sentiment-analysis';
  public searchText: string;
  private apiKey: string;
  public items: Array<{id: string, title: string, description: string, show: string}> = [];
  public news: Array<{id: string, title: string, description: string}> = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:5000/apikey').subscribe((d: string) => this.apiKey = d);
  }

  getData() {
    console.log('1');
    this.getLatestNews();
    console.log('4');
    this.items = [];
    const headers = new HttpHeaders({
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    this.http.get(`http://localhost:5000/user/${this.searchText}/10`, {headers})
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

  getLatestNews() {
    console.log('2');
    this.http.get(`https://newsapi.org/v2/everything?q=${this.searchText}&language=en&sortby=publishedAt&apiKey=${this.apiKey}`)
    .subscribe((res: any) => {
      for (let i = 1; i <= 3 ; i++) {
        this.news.push({
          id: 'tag' + i,
          title: res.articles[i].title,
          description: res.articles[i].description
        });
      }
      console.log(this.news);
    });
    console.log('3');
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
