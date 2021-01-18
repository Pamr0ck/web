import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {Settings} from '../settings';
import {SettingsService} from '../settings.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './settings.component.html',
  providers: [SettingsService]
})
export class SettingsComponent implements OnInit {
  settings: Settings;
  statusMessage: string;

  constructor(private serv: SettingsService) {
  }

  ngOnInit() {
    this.loadSettings();
  }

  private loadSettings() {
    this.serv.getSettings().subscribe((data: Settings) => {
      this.settings = data;
      console.log(data);
    });
  }

  saveSettings() {
    // let startDate = '2020-11-05T17:43:05.239Z'
    let startDate = `${this.settings.startDate}T${this.settings.startTime}:00.000Z`
    let endTime = `${this.settings.endDate}T${this.settings.endTime}:00.000Z`
    if (new Date(startDate) > new Date(endTime)) {
      alert('Дата завершения не может быть позже даты окончания');
      return;
    }
    if (this.settings.interval < 0) {
      alert('Интервал не может быть отрицательным');
      return;
    }
    this.serv.updateSettings(this.settings).subscribe(data => {
      this.loadSettings();
      this.statusMessage = 'Данные успешно обновлены'
    });
  }
}
