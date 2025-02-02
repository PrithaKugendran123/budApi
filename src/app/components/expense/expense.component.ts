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
      this.expenses = data.$values; // Access $values from the response
      this.filteredExpenses = this.expenses;
      console.log('Expenses fetched from backend:', this.expenses);
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
    console.log('Filtered Expenses:', this.filteredExpenses);
  }
  onCategoryChange(): void {
    console.log('Selected Category:', this.newExpense.category); // Log the selected category
    const selectedBudget = this.categoryToBudgetMap[this.newExpense.category];
    console.log('Mapped Budget ID:', selectedBudget); // Log the mapped budget ID
  
    if (selectedBudget !== undefined) {
      this.newExpense.budgetId = selectedBudget;
      console.log('Updated Budget ID:', this.newExpense.budgetId); // Log the updated budget ID
    } else {
      console.log('No budget found for category:', this.newExpense.category);
    }
  }
  

  // Populate the form for editing an expense
  editExpense(expense: Expense): void {
    this.newExpense = { ...expense };
    this.isEditMode = true;
    this.newExpense.date = this.formatDate(expense.date);
    this.selectedCategory = expense.category;  // Set selected category on edit
    this.onCategoryChange(); // Update the budgetId based on selected category

    // After editing, log the selected category and budget ID
    console.log('Selected Category:', this.selectedCategory);
    console.log('Selected Budget ID:', this.newExpense.budgetId);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateExpense(): void {
    console.log('Before updating or adding expense:', this.newExpense);  // Log the new expense data
    if (this.isEditMode) {
      this.expenseService.updateExpense(this.newExpense.expenseId, this.newExpense).subscribe(() => {
        this.getExpenses();
        this.resetForm();
      });
    } else {
      this.expenseService.addExpense(this.newExpense).subscribe(
        (data) => {
          console.log('Expense added successfully:', data);
          this.expenses.push(data);
          this.filterByCategory();
          this.resetForm();
        },
        (error) => {
          console.error('Error adding expense:', error);
          // Log full error message here for better insights
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
        console.log(`Expense with ID ${expenseId} deleted successfully.`);
      });
    }
  }

  // Reset the form after adding or editing an expense
  resetForm(): void {
    this.newExpense = { expenseId: 0, budgetId: 0, amount: 0, date: '', category: '', notes: '', createdAt: new Date() };
    this.isEditMode = false;
  }
}
