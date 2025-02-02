import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  remainingBudget: number = 0;
  selectedMonth: string = '';  // To store the selected month
  incomeForMonth: number = 0;
  expenseForMonth: number = 0;
  balanceForMonth: number = 0;

  constructor(private userService: UserService ,transactionService:TransactionService) {}

  ngOnInit(): void {
    this.loadDashboardData();  // Load initial data
  }

  // Method to load the data for the selected month
  loadMonthData(): void {
    if (!this.selectedMonth) return; // Check if a month is selected

    this.userService.getMonthData(this.selectedMonth).subscribe(data => {
      this.incomeForMonth = data.totalIncome;
      this.expenseForMonth = data.totalExpenses;
      this.balanceForMonth = this.incomeForMonth - this.expenseForMonth;
    });
  }

  // This will fetch the default data (overall)
  loadDashboardData() {
    this.userService.getDashboardMetrics().subscribe(data => {
      this.totalIncome = data.totalIncome;
      this.totalExpenses = data.totalExpenses;
      this.remainingBudget = data.remainingBudget;
    });
  }
  
}
