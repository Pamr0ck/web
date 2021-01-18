import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {Broker} from '../broker';
import {BrokerService} from '../broker.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './brokers.component.html',
  providers: [BrokerService]
})
export class BrokersComponent implements OnInit {
  //типы шаблонов
  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  editedBroker: Broker;
  brokers: Array<Broker>;
  isNewRecord: boolean;
  statusMessage: string;

  constructor(private serv: BrokerService) {
    this.brokers = new Array<Broker>();
  }

  ngOnInit() {
    this.loadBrokers();
  }

  //загрузка пользователей
  private loadBrokers() {
    this.serv.getBrokers().subscribe((data: Broker[]) => {
      this.brokers = data;
    });
  }

  // добавление пользователя
  private maxId: number;
  addBroker() {
    this.maxId = 0;
    for (const broker of this.brokers){
      if (broker.id > this.maxId){
        this.maxId = broker.id;
      }
    }
    this.editedBroker = new Broker(this.maxId + 1, "", 0);
    this.brokers.push(this.editedBroker);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editBroker(broker: Broker) {
    this.editedBroker = new Broker(broker.id, broker.name, broker.money);
  }

  // загружаем один из двух шаблонов
  loadTemplate(broker: Broker) {
    if (this.editedBroker && this.editedBroker.id === broker.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // сохраняем пользователя
  saveBroker() {
    if (this.editedBroker.money < 0) {
      alert("Денежный запас должен быть не отрицательным");
      return;
    }
    if (this.isNewRecord) {
      // добавляем пользователя
      this.serv.createBroker(this.editedBroker).subscribe(data => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadBrokers();
      });
      this.isNewRecord = false;
      this.editedBroker = null;
    } else {
      // изменяем пользователя
      this.serv.updateBroker(this.editedBroker).subscribe(data => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadBrokers();
      });
      this.editedBroker = null;
    }
  }

  // отмена редактирования
  cancel() {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.brokers.pop();
      this.isNewRecord = false;
    }
    this.editedBroker = null;
  }

  // удаление пользователя
  deleteBroker(broker: Broker) {
    this.serv.deleteBroker(broker.id).subscribe(data => {
      this.statusMessage = 'Данные успешно удалены',
        this.loadBrokers();
    });
  }
}
