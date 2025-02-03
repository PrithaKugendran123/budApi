import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  categories: string[] = ['Groceries', 'Utilities', 'Travel', 'Entertainment'];
  selectedCategory: string = '';
  newExpense: Expense = { 
    expenseId: 0, 
    budgetId: 0, 
    amount: 0, 
    date: '', 
    category: '', 
    notes: '', 
    createdAt: new Date() 
  };
  isEditMode: boolean = false;

  // Define the category-to-budget map with index signature
  categoryToBudgetMap: { [key: string]: number } = {
    'Groceries': 1,
    'Entertainment': 2,
    'Utilities': 3,
    'Travel': 4
  };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  // Fetch all expenses from the backend
  getExpenses(): void {
    this.expenseService.getExpenses().subscribe((data: any) => {
      console.log('Fetched expenses:', data);
      this.expenses = data.$values || data;  // Fix if the response structure is different
      this.filteredExpenses = this.expenses;
    });
  }

  // Filter expenses based on the selected category
  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredExpenses = this.expenses.filter(expense => 
        expense.category.trim().toLowerCase() === this.selectedCategory.trim().toLowerCase()
      );
    } else {
      this.filteredExpenses = [...this.expenses]; // Reset to show all if no category selected
    }
  }

  // Handle category change
  onCategoryChange(): void {
    console.log('Selected Category:', this.newExpense.category); // Log the selected category
    const selectedBudget = this.categoryToBudgetMap[this.newExpense.category];
    if (selectedBudget !== undefined) {
      this.newExpense.budgetId = selectedBudget;  // Set the budgetId for the selected category
    }
  }

  // Populate the form for editing an expense
  editExpense(expense: Expense): void {
    this.newExpense = { ...expense };
    this.isEditMode = true;
    this.newExpense.date = this.formatDate(expense.date);
    this.selectedCategory = expense.category;  // Set selected category on edit
    this.onCategoryChange();
  }

  // Format date for input field
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Update or Add expense
  updateExpense(): void {
    const expenseToSubmit = {
      CategoryName: this.newExpense.category,
      Amount: this.newExpense.amount,
      Date: this.newExpense.date,
      Notes: this.newExpense.notes
    };

    if (this.isEditMode) {
      this.expenseService.updateExpense(this.newExpense.expenseId, expenseToSubmit).subscribe(() => {
        this.getExpenses(); // Refresh expenses list
        this.resetForm(); // Reset form fields
      });
    } else {
      this.expenseService.addExpense(expenseToSubmit).subscribe(
        (data) => {
          this.expenses.push(data); // Add new expense to list
          this.filterByCategory(); // Apply category filter
          this.resetForm(); // Reset form
        },
        (error) => {
          console.error('Error adding expense:', error);
        }
      );
    }
  }

  // Delete an expense by its ID
  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(expenseId).subscribe(() => {
        this.expenses = this.expenses.filter(expense => expense.expenseId !== expenseId);
        this.filteredExpenses = this.filteredExpenses.filter(expense => expense.expenseId !== expenseId);
      });
    }
  }

  // Reset the form after adding or editing an expense
  resetForm(): void {
    this.newExpense = { expenseId: 0, budgetId: 0, amount: 0, date: '', category: '', notes: '', createdAt: new Date() };
    this.isEditMode = false;
  }
}
