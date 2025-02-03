import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../../services/income.service';
import { Incomes } from '../../models/incomes.model';

@Component({
  selector: 'app-income',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent implements OnInit {
  incomes: Incomes[] = []; // Initialize as an empty array
  filteredIncomes: Incomes[] = [];
  categories: string[] = ['Salary', 'Business', 'Investments', 'Freelance', 'Other'];
  selectedCategory: string = '';
  newIncome: Incomes = {
    incomeId: 0,
    userId: 0,  // Will be filled automatically with current user's ID
    amount: 0,
    date: '',
    category: '',
    notes: ''
  };
  isEditMode: boolean = false;

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.getIncomes();
  }

  // Get incomes for the current user
  getIncomes(): void {
    this.incomeService.getIncomes().subscribe(
      (response: any) => {
        // Assuming the incomes are inside the "$values" property
        this.incomes = response.$values || []; // Ensure that incomes is an array
        this.filteredIncomes = [...this.incomes]; // Make a shallow copy of incomes
      },
      (error) => {
        console.error('Error fetching incomes:', error);
        // You can show an error message to the user here
      }
    );
  }

  // Filter incomes by category
  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredIncomes = this.incomes.filter(income => income.category === this.selectedCategory);
    } else {
      this.filteredIncomes = [...this.incomes];
    }
  }

  // Edit an existing income
  editIncome(income: Incomes): void {
    this.newIncome = { ...income };
    this.isEditMode = true;
    this.newIncome.date = this.formatDate(income.date); // Format the date for input
  }

  // Format date to 'YYYY-MM-DD'
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add or update an income
  updateIncome(): void {
    if (this.isEditMode) {
      this.incomeService.updateIncome(this.newIncome.incomeId, this.newIncome).subscribe(
        () => {
          this.getIncomes();  // Refresh the list
          this.resetForm();
        },
        (error) => {
          console.error('Error updating income:', error);
        }
      );
    } else {
      this.newIncome.userId = 1; // Replace with actual user ID if needed
      this.incomeService.addIncome(this.newIncome).subscribe(
        (data) => {
          this.incomes.push(data);
          this.filterByCategory();
          this.resetForm();
        },
        (error) => {
          console.error('Error adding income:', error);
        }
      );
    }
  }

  // Delete an income
  deleteIncome(id: number): void {
    this.incomeService.deleteIncome(id).subscribe(
      () => {
        this.incomes = this.incomes.filter(income => income.incomeId !== id);
        this.filterByCategory();
      },
      (error) => {
        console.error('Error deleting income:', error);
      }
    );
  }

  // Reset form after add/edit
  resetForm(): void {
    this.newIncome = { incomeId: 0, userId: 0, amount: 0, date: '', category: '', notes: '' };
    this.isEditMode = false;
  }
}
