const EXPENSES_KEY = "expenses";

export const getExpenses = async () => {
    const expensesJson = localStorage.getItem(EXPENSES_KEY);
    return expensesJson ? JSON.parse(expensesJson) : [];
};

export const setExpenses = async (expenses) => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const addExpense = async (expense) => {
    const expenses = await getExpenses();
    expenses.push(expense);
    setExpenses(expenses);
};

export const deleteExpense = async (id) => {
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
};

export const editExpense = async (id, updatedExpense) => {
    const expenses = await getExpenses();
    const index = expenses.findIndex((expense) => expense.id === id);
    expenses[index] = { ...expenses[index], ...updatedExpense };
    setExpenses(expenses);
};
