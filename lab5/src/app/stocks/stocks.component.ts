import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {Stock} from '../stock';
import {StockService} from '../stock.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './stocks.component.html',
  providers: [StockService]
})
export class StocksComponent implements OnInit {
  //типы шаблонов
  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  editedStock: Stock;
  stocks: Array<Stock>;
  isNewRecord: boolean;
  statusMessage: string;

  constructor(private serv: StockService) {
    this.stocks = new Array<Stock>();
  }

  ngOnInit() {
    this.loadStocks();
  }

  //загрузка пользователей
  private loadStocks() {
    this.serv.getStocks().subscribe((data: Stock[]) => {
      this.stocks = data;
    });
  }

  // добавление пользователя
  private maxId: number;
  addStock() {
    this.maxId = 0;
    for (const stock of this.stocks){
      if (stock.id > this.maxId){
        this.maxId = stock.id;
      }
    }
    this.editedStock = new Stock(this.maxId + 1, 0, "", 0, 0);
    this.stocks.push(this.editedStock);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editStock(stock: Stock) {
    this.editedStock = new Stock(stock.id, stock.startingPrice, stock.type, stock.maxChangeValue, stock.quantity);
  }

  // загружаем один из двух шаблонов
  loadTemplate(stock: Stock) {
    if (this.editedStock && this.editedStock.id === stock.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // сохраняем пользователя
  saveStock() {
    if (this.editedStock.startingPrice < 0) {
      alert("Стартовая цена не может быть не отрицательной");
      return;
    }
    if (this.editedStock.maxChangeValue < 0) {
      alert("Максимальная цена не может быть не отрицательной");
      return;
    }
    if (this.editedStock.quantity < 0) {
      alert("Количество не может быть не отрицательным");
      return;
    }
    if (this.isNewRecord) {
      // добавляем пользователя
      this.serv.createStock(this.editedStock).subscribe(data => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadStocks();
      });
      this.isNewRecord = false;
      this.editedStock = null;
    } else {
      // изменяем пользователя
      this.serv.updateStock(this.editedStock).subscribe(data => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadStocks();
      });
      this.editedStock = null;
    }
  }

  // отмена редактирования
  cancel() {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.stocks.pop();
      this.isNewRecord = false;
    }
    this.editedStock = null;
  }

  // удаление пользователя
  deleteStock(stock: Stock) {
    this.serv.deleteStock(stock.id).subscribe(data => {
      this.statusMessage = 'Данные успешно удалены',
        this.loadStocks();
    });
  }
}
