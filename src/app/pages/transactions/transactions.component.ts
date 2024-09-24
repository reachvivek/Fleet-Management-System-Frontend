import { Component } from '@angular/core';
import { Transaction, TransactionService } from '../../../swagger';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  showLoader: boolean = false;
  transactions: Transaction[] = [];
  filter: {
    startDate: string | undefined;
    endDate: string | undefined;
    vehicleNumber: string | undefined;
  } = { startDate: undefined, endDate: undefined, vehicleNumber: undefined };
  rangeDates = [];
  columns: any[] = [
    { field: 'processingDateTime', header: 'Processing Date' },
    { field: 'transactionDateTime', header: 'Transaction Date' },
    { field: 'transactionAmount', header: 'Amount' },
    { field: 'transactionId', header: 'Transaction ID' },
    { field: 'hexTagId', header: 'Hex Tag ID' },
    { field: 'vehicleNumber', header: 'Vehicle Number' },
    { field: 'laneCode', header: 'Lane Code' },
    { field: 'plazaCode', header: 'Plaza Code' },
    { field: 'transactionStatus', header: 'Status' },
    { field: 'transactionReferenceNumber', header: 'Reference Number' },
    { field: 'plazaName', header: 'Plaza Name' },
  ];
  maxDate: Date = new Date();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadTransactions();
  }

  formatDate(date: Date | null): string | undefined {
    if (!date) return undefined;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  applyDates() {
    this.filter.startDate = this.formatDate(this.rangeDates[0]);
    this.filter.endDate = this.formatDate(this.rangeDates[1]);
  }

  async loadTransactions() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.transactionService.transactionGetTransactionsGet(
          this.filter.startDate || undefined,
          this.filter.endDate || undefined,
          this.filter.vehicleNumber || undefined
        )
      );
      this.transactions = [...res];
      this.transactions.forEach((item: Transaction) => {
        if (item.transactionDateTime) {
          item.transactionDateTime = new Date(item.transactionDateTime);
        }
        if (item.processingDateTime) {
          item.processingDateTime = new Date(item.processingDateTime);
        }
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  clearFilters() {
    this.rangeDates = [];
    this.filter = {
      vehicleNumber: undefined,
      startDate: undefined,
      endDate: undefined,
    };
    this.loadTransactions();
  }

  // Method to generate export file name
  generateExportName(): string {
    const date = new Date();
    return `transactions_${date.getFullYear()}_${
      date.getMonth() + 1
    }_${date.getDate()}.csv`;
  }
}
