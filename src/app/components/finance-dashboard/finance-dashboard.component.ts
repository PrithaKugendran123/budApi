import { Component, OnInit } from '@angular/core';
import { TransactionsLog } from '../../models/transaction-logs.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.css']
})
export class FinanceDashboardComponent implements OnInit {
  transactions: TransactionsLog[] = [];
  totalIncome: number = 0;
  totalExpenses: number = 0;
  selectedMonth: number = new Date().getMonth() + 1; // Default to current month
  selectedYear: number = new Date().getFullYear(); // Default to current year

  constructor(private transactionsService: TransactionService) {}

  ngOnInit(): void {
    this.loadMonthData();
  }

  loadMonthData(): void {
    console.log(`Loading data for ${this.selectedMonth}/${this.selectedYear}`);
    this.transactionsService.getTransactionsByMonth(this.selectedMonth, this.selectedYear)
      .subscribe(data => {
        console.log('Transactions data:', data);
        this.transactions = data;
        
        this.totalIncome = this.transactions
          .filter(t => t.transactionType === 'Income')
          .reduce((sum, t) => sum + t.amount, 0);
  
        this.totalExpenses = this.transactions
          .filter(t => t.transactionType === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);
      });
  }
  
}
