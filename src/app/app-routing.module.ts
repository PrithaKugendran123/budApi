import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { BudgetComponent } from './components/budgets/budgets.component';
import { IncomesComponent } from './components/incomes/incomes.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { TransactionService } from './services/transaction.service';
import { FinanceDashboardComponent } from './components/finance-dashboard/finance-dashboard.component';
import { NavComponent } from './components/nav/nav.component';

const routes: Routes = [  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard on load
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserListComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'incomes', component: IncomesComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'nav', component: NavComponent },
  { path: 'transaction', component: FinanceDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
