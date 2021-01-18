import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Settings} from './settings';

@Injectable()
export class SettingsService {

  private url = "http://localhost:3000/api/settings";

  constructor(private http: HttpClient) {
  }

  getSettings() {
    return this.http.get(this.url);
  }

  updateSettings(settings: Settings) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put(this.url, JSON.stringify(settings), {headers: myHeaders});
  }
}
