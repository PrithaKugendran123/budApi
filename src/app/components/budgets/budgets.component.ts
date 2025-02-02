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
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe((data) => {
      this.budgets = data;
    });
  }

  addBudget(): void {
    this.budgetService.addBudget(this.formBudget).subscribe(() => {
      this.loadBudgets();
      this.resetForm();
    });
  }

  editBudget(budget: Budget): void {
    this.selectedBudget = { ...budget }; // Make sure selectedBudget is set correctly
    this.formBudget = { ...budget };    // Populate form with selected budget
  }
  

  updateBudget(): void {
    console.log('Selected Budget:', this.selectedBudget);
    console.log('Budget ID:', this.selectedBudget?.budgetId); // Use budgetId here, not budgetID
  
    if (this.selectedBudget && this.selectedBudget.budgetId !== undefined) { // Check for budgetId
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
      this.loadBudgets();
    });
  }

  resetForm(): void {
    this.selectedBudget = null;
    this.formBudget = this.getEmptyBudget();
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
