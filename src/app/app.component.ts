import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Ticker } from './ticker-enum';
import { WebsocketService } from './websocket.service';

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
  public news: Array<{id: string, title: string, description: string, url: string}> = [];
  public currentPrice: string;
  public arrowColor = 'blue';
  public arrowType: string;
  public twitterTrendColor = 'blue';
  public twitterTrendArrow: string;
  public twitterTrend: string;
  public message = [];

  constructor(private http: HttpClient, private socket: WebsocketService) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:5000/apikey').subscribe((d: string) => this.apiKey = d);
  }

  getData() {
    // this.getLatestNews();
    this.getLatestTickerPrice();
    this.getTickerNews();

    this.items = [];
    this.news = [];
    const headers = new HttpHeaders({
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    this.http.get(`http://localhost:5000/tweets/${this.searchText}/50`, {headers})
    .subscribe((res: any) => {
      console.log('Got the Response');
      console.log(res);
      const tweets = res.tweets;
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

      if (res.trend === 'positive') {
        this.twitterTrend = 'Positive';
        this.twitterTrendColor = 'green';
        this.twitterTrendArrow = 'fa fa-arrow-up';
      } else if (res.trend === 'negative') {
        this.twitterTrend = 'Negative';
        this.twitterTrendColor = 'red';
        this.twitterTrendArrow = 'fa fa-arrow-down';
      } else {
        this.twitterTrend = 'Neutral';
        this.twitterTrendColor = 'blue';
        this.twitterTrendArrow = 'fa fa-arrow-up';
      }
    });
  }

  getLatestNews() {
    this.http.get(`https://newsapi.org/v2/everything?q=${this.searchText}&language=en&sortby=publishedAt&apiKey=${this.apiKey}`)
    .subscribe((res: any) => {
      for (let i = 1; i <= 3 ; i++) {
        this.news.push({
          id: 'tag' + i,
          title: res.articles[i].title,
          description: res.articles[i].description,
          url: ''
        });
      }
    });
  }

  getLatestTickerPrice() {
    const tickerSymbol = Ticker[this.searchText.toUpperCase()];
    const res = this.http.get(`http://localhost:5000/ticker/${tickerSymbol}`);

    res.subscribe((data: any) => {
      console.log(data);
      if (data && !data.error) {
        this.currentPrice = data.current_price;
        if (data.trend === 'up') {
          this.arrowColor = 'green';
          this.arrowType = 'fa fa-arrow-up';
        } else {
          this.arrowColor = 'red';
          this.arrowType = 'fa fa-arrow-down';
        }
      }
    });
  }

  getTickerNews() {
    const tickerSymbol = Ticker[this.searchText.toUpperCase()];
    const res = this.http.get(`http://localhost:5000/tickernews/${tickerSymbol}`);

    res.subscribe((data: any) => {
      console.log(data);
      if (data && !data.error) {
        let count = 1;
        data.forEach((d) => {
          this.news.push({
            id: 'tag' + count,
            title: d.source,
            description: d.headline,
            url: d.url
          });
          count += 1;
        });
      }
    });
  }

  public cleanUp() {
    this.currentPrice = '';
    this.arrowColor = '';
    this.arrowType = '';
    this.twitterTrendColor = '';
    this.twitterTrendArrow = '';
    this.twitterTrend = '';
    this.items = [];
    this.news = [];
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
