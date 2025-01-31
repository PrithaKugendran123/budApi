use budgetTracker

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE Budgets (
    BudgetID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    CategoryName NVARCHAR(100) NOT NULL,
    BudgetAmount DECIMAL(10, 2) NOT NULL,
    Duration NVARCHAR(50) CHECK (Duration IN ('Monthly', 'Weekly', 'Yearly')) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

SELECT * FROM TransactionsLog WHERE MONTH(Date) = 2 AND YEAR(Date) = 2025;


CREATE TABLE Expenses (
    ExpenseID INT PRIMARY KEY IDENTITY(1,1),
    BudgetID INT FOREIGN KEY REFERENCES Budgets(BudgetID),
    Amount DECIMAL(10, 2) NOT NULL,
    Date DATETIME NOT NULL,
    Notes NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE Income (
    IncomeID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Amount DECIMAL(10, 2) NOT NULL,
    Date DATETIME NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Notes NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE RecurringTransactions (
    TransactionID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    TransactionType NVARCHAR(50) CHECK (TransactionType IN ('Income', 'Expense')) NOT NULL,
    CategoryName NVARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Frequency NVARCHAR(50) CHECK (Frequency IN ('Daily', 'Weekly', 'Monthly', 'Yearly')) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
    Notes NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE TransactionsLog (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    TransactionType NVARCHAR(50) NOT NULL,
    CategoryName NVARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Date DATETIME NOT NULL,
    Notes NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);
-- Insert sample data into Users table
INSERT INTO Users (Name, Email, PasswordHash, CreatedAt) VALUES
('Sarah Smith', 'sarah@example.com', 'hashed_password_123', '2025-01-01 10:00:00'),
('John Doe', 'john.doe@example.com', 'hashed_password_456', '2025-01-02 11:30:00');

-- Insert sample data into Budgets table
INSERT INTO Budgets (UserID, CategoryName, BudgetAmount, Duration, CreatedAt) VALUES
(1, 'Groceries', 500.00, 'Monthly', '2025-01-01 10:15:00'),
(1, 'Entertainment', 200.00, 'Monthly', '2025-01-01 10:15:00'),
(1, 'Utilities', 150.00, 'Monthly', '2025-01-01 10:15:00'),
(2, 'Travel', 1000.00, 'Yearly', '2025-01-02 12:00:00');

-- Insert sample data into Expenses table
INSERT INTO Expenses (BudgetID, Amount, Date, Notes, CreatedAt) VALUES
(1, 30.00, '2025-01-15', 'Fruits', '2025-01-15 10:30:00'),
(1, 20.00, '2025-01-16', 'Vegetables', '2025-01-16 14:45:00'),
(2, 50.00, '2025-01-18', 'Concert Tickets', '2025-01-18 18:20:00');

-- Insert sample data into Income table
INSERT INTO Income (UserID, Amount, Date, Category, Notes, CreatedAt) VALUES
(1, 4000.00, '2025-01-05', 'Salary', 'Monthly salary', '2025-01-05 09:00:00'),
(2, 2000.00, '2025-01-10', 'Freelance', 'Freelance project payment', '2025-01-10 11:00:00');

-- Insert sample data into RecurringTransactions table
INSERT INTO RecurringTransactions (UserID, TransactionType, CategoryName, Amount, Frequency, StartDate, EndDate, Notes, CreatedAt) VALUES
(1, 'Expense', 'Housing', 1200.00, 'Monthly', '2025-02-01', NULL, 'Rent Payment', '2025-01-01 08:00:00'),
(1, 'Expense', 'Entertainment', 15.00, 'Monthly', '2025-02-01', NULL, 'Spotify Subscription', '2025-01-01 08:00:00'),
(1, 'Expense', 'Utilities', 60.00, 'Monthly', '2025-02-01', NULL, 'Electricity Bill', '2025-01-01 08:00:00'),
(1, 'Income', 'Salary', 4000.00, 'Monthly', '2025-02-05', NULL, 'Monthly Salary', '2025-01-01 08:00:00');

-- Insert sample data into TransactionsLog table
INSERT INTO TransactionsLog (UserID, TransactionType, CategoryName, Amount, Date, Notes, CreatedAt) VALUES
(1, 'Expense', 'Groceries', 30.00, '2025-01-15', 'Fruits', '2025-01-15 10:30:00'),
(1, 'Expense', 'Groceries', 20.00, '2025-01-16', 'Vegetables', '2025-01-16 14:45:00'),
(1, 'Expense', 'Entertainment', 50.00, '2025-01-18', 'Concert Tickets', '2025-01-18 18:20:00'),
(1, 'Income', 'Salary', 4000.00, '2025-01-05', 'Monthly salary', '2025-01-05 09:00:00');
