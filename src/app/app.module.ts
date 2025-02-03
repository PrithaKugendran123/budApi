import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetComponent } from './components/budgets/budgets.component';
import { IncomesComponent } from './components/incomes/incomes.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { FinanceDashboardComponent } from './components/finance-dashboard/finance-dashboard.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [AppComponent, UserListComponent, DashboardComponent, BudgetComponent, IncomesComponent, ExpenseComponent, FinanceDashboardComponent, NavComponent, LoginComponent, RegisterComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule,FormsModule,
    ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
