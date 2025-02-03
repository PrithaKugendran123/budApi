import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budgets.service';
import { Budget } from '../../models/budget.model';

@Component({
  selector: 'app-budget',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  selectedBudget: Budget | null = null;
  formBudget: Budget = this.getEmptyBudget();

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets(); // Call to load budgets when component is initialized
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(
      (data: any) => {
        console.log('Budgets Data:', data); // Log the data for debugging
        this.budgets = data.$values || []; // If data is wrapped in $values, unwrap it
      },
      (error) => {
        console.error('Error loading budgets:', error); // Log error details
      }
    );
  }

  addBudget(): void {
    this.budgetService.addBudget(this.formBudget).subscribe(() => {
      this.loadBudgets(); // Reload the list after adding the budget
      this.resetForm(); // Reset the form after add
    });
  }

  editBudget(budget: Budget): void {
    this.selectedBudget = { ...budget }; // Set selected budget
    this.formBudget = { ...budget };    // Populate form with selected budget
  }

  updateBudget(): void {
    if (this.selectedBudget && this.selectedBudget.budgetId !== undefined) {
      this.budgetService.updateBudget(this.selectedBudget.budgetId, this.formBudget).subscribe(() => {
        this.loadBudgets(); // Reload the list after updating
        this.resetForm(); // Reset the form after update
      });
    } else {
      console.error('Invalid budget ID');
    }
  }

  deleteBudget(id: number): void {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.loadBudgets(); // Reload the list after deleting
    });
  }

  resetForm(): void {
    this.selectedBudget = null;
    this.formBudget = this.getEmptyBudget(); // Reset form data
  }

  private getEmptyBudget(): Budget {
    return {
      budgetId: 0,
      userID: 1, // Set this dynamically if needed
      categoryName: '',
      budgetAmount: 0,
      duration: 'Monthly',
      createdAt: new Date(),
    };
  }
}
