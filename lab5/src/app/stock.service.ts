import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Stock} from './stock';

@Injectable()
export class StockService {

  private url = "http://localhost:3000/api/stocks";

  constructor(private http: HttpClient) {
  }

  getStocks() {
    return this.http.get(this.url);
  }

  createStock(stock: Stock) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.url, JSON.stringify(stock), {headers: myHeaders});
  }

  updateStock(stock: Stock) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put(this.url + '/' + stock.id, JSON.stringify(stock), {headers: myHeaders});
  }

  deleteStock(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
