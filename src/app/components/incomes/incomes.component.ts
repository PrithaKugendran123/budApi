import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../../services/income.service';
import { Incomes } from '../../models/incomes.model';

@Component({
  selector: 'app-income',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent implements OnInit {
  incomes: Incomes[] = []; // Full income list
  filteredIncomes: Incomes[] = []; // Filtered list based on category selection
  categories: string[] = ['Salary', 'Business', 'Investments', 'Freelance', 'Other']; // Example categories
  selectedCategory: string = ''; // Selected category for filtering

  newIncome: Incomes = { 
    incomeId: 0, 
    userId: 1, 
    amount: 0, 
    date: '', // Change date to string initially
    category: '', 
    notes: ''
  };

  isEditMode: boolean = false; // To check if the form is in edit mode

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.getIncomes();
  }

  // Fetch all incomes
  getIncomes(): void {
    this.incomeService.getIncomes().subscribe((data) => {
      this.incomes = data;
      this.filteredIncomes = data;
    });
  }

  // Filter incomes by category
  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredIncomes = this.incomes.filter(income => income.category === this.selectedCategory);
    } else {
      this.filteredIncomes = [...this.incomes];
    }
  }

  // Populate form with selected income for editing
  editIncome(income: Incomes): void {
    this.newIncome = { ...income }; // Copy the selected income to the form
    this.isEditMode = true;

    // Format the date to 'YYYY-MM-DD' for the input field
    this.newIncome.date = this.formatDate(income.date);
  }

  // Utility function to format date as 'YYYY-MM-DD'
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // Add leading zero for months
    const day = d.getDate().toString().padStart(2, '0');  // Add leading zero for days
    return `${year}-${month}-${day}`;
  }

  // Update income if in edit mode, otherwise add a new one
  updateIncome(): void {
    if (this.isEditMode) {
      this.incomeService.updateIncome(this.newIncome.incomeId, this.newIncome).subscribe(() => {
        this.getIncomes(); // Refresh the list
        this.resetForm();
      });
    } else {
      this.incomeService.addIncome(this.newIncome).subscribe((data) => {
        this.incomes.push(data);
        this.filterByCategory(); // Apply category filter again
        this.resetForm();
      });
    }
  }

  // Delete an income record
  deleteIncome(id: number): void {
    this.incomeService.deleteIncome(id).subscribe(() => {
      this.incomes = this.incomes.filter(income => income.incomeId !== id);
      this.filterByCategory(); // Apply category filter again
    });
  }

  // Reset form after adding/updating income
  resetForm(): void {
    this.newIncome = { incomeId: 0, userId: 1, amount: 0, date: '', category: '', notes: '' };
    this.isEditMode = false;
  }
}
