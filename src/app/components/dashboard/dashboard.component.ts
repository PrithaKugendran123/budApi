import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  remainingBudget: number = 0;
  isLoading: boolean = false;  // Added loading state
  error: string = '';  // Added error state for better UI feedback

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }
  loadDashboardData(): void {
    this.isLoading = true;  // Set loading state to true when data is being fetched
    this.error = '';  // Reset any previous errors
  
    // Fetch total income
    this.dashboardService.getTotalIncome().subscribe(
      (incomes) => {
        console.log('Incomes Response:', incomes);  // Log full response for debugging
  
        // Extract total income (adjust if necessary based on your API response structure)
        if (incomes && incomes.$values && incomes.$values.length > 0) {
          this.totalIncome = incomes.$values.reduce((sum: number, income: any) => sum + income.amount, 0);
        } else {
          this.totalIncome = 0;
        }
  
        this.updateRemainingBudget();
        console.log('Total Income:', this.totalIncome);  // Log total income value
      },
      (error) => {
        console.error('Error fetching total income:', error);
        this.error = 'Failed to load total income. Please try again later.';
        this.isLoading = false;  // Set loading state to false on error
      }
    );
  
    // Fetch total expenses
    this.dashboardService.getDashboardData().subscribe(
      (expensesData) => {
        console.log('Dashboard Data:', expensesData);  // Log the expenses data for debugging
  
        // Assuming expensesData is a number or contains a $values array
        this.totalExpenses = expensesData ?? 0;  // Adjust based on the structure of your expenses data
        this.updateRemainingBudget();
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;  // Set loading state to false on error
      }
    );
  }
  
  updateRemainingBudget(): void {
    this.remainingBudget = this.totalIncome - this.totalExpenses;
  }
}
