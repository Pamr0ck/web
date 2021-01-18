import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Broker} from './broker';

@Injectable()
export class BrokerService {

  private url = "http://localhost:3000/api/brokers";

  constructor(private http: HttpClient) {
  }

  getBrokers() {
    return this.http.get(this.url);
  }

  createBroker(broker: Broker) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.url, JSON.stringify(broker), {headers: myHeaders});
  }

  updateBroker(broker: Broker) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put(this.url + '/' + broker.id, JSON.stringify(broker), {headers: myHeaders});
  }

  deleteBroker(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
