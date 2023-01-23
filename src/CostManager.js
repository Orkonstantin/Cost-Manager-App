import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Form, Dropdown, Button } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { useEffect } from "react";
import "./styles.css";
import {
    getExpenses,
    setExpenses,
    addExpense,
    deleteExpense,
    editExpense
} from "./LocalStorage";

const CostManager = () => {
    // State to hold the expenses data
    const [expenses, setExpenses] = useState([]);

    // State to hold the form data
    const [formData, setFormData] = useState({
        itemName: "",
        cost: "",
        category: ""
    });

    // State to hold the current expense id when editing
    const [currentExpenseId, setCurrentExpenseId] = useState(null);

    // State to hold the sort criteria
    const [sortCriteria, setSortCriteria] = useState("date");

    // State to hold the year filter
    const [yearFilter, setYearFilter] = useState("all");

    // State to hold the month filter
    const [monthFilter, setMonthFilter] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            const expenses = await getExpenses();
            setExpenses(expenses);
        };
        fetchData();
    }, []);

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Validate form data
        if (!formData.itemName || !formData.cost || !formData.category) {
            alert("Please fill in all required fields.");
            return;
        }

        if (isNaN(formData.cost) || formData.cost < 0) {
            alert("Please enter a valid positive number for cost.");
            return;
        }

        // Add new expense to the expenses array
        const newExpense = {
            ...formData,
            id: Date.now(),
            year: new Date().getFullYear(),
            month: new Date().getMonth()
        };
        await addExpense(newExpense);
        setExpenses([...expenses, newExpense]);

        // Clear the form fields
        setFormData({
            itemName: "",
            cost: "",
            category: ""
        });
    };

    // Function to handle expense deletion
    const handleDeleteClick = async (id) => {
        await deleteExpense(id);
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
    };

    // Function to handle expense editing
    const handleEditClick = async (id) => {
        // Update the state with the current expense data
        // to be used in the form fields
        const expenseToEdit = expenses.find((expense) => expense.id === id);
        setFormData({
            itemName: expenseToEdit.itemName,
            cost: expenseToEdit.cost,
            category: expenseToEdit.category
        });

        // Set the current expense id in the state
        // to be used in the form submission
        setCurrentExpenseId(id);
    };

    // Function to handle form submission when editing an expense
    const handleEditFormSubmit = async (event) => {
        event.preventDefault();

        // Validate form data
        if (!formData.itemName || !formData.cost || !formData.category) {
            alert("Please fill in all required fields.`");
            return;
        }

        if (isNaN(formData.cost) || formData.cost < 0) {
            alert("Please enter a valid positive number for cost.");
            return;
        }

        // Edit the expense in the expenses array
        await editExpense(currentExpenseId, formData);

        // Update the state with the updated expenses
        const updatedExpenses = expenses.map((expense) => {
            if (expense.id === currentExpenseId) {
                return { ...expense, ...formData };
            }
            return expense;
        });
        setExpenses(updatedExpenses);

        // Clear the form fields and the current expense id
        setFormData({
            itemName: "",
            cost: "",
            category: ""
        });
        setCurrentExpenseId(null);
    };


    // Function to handle input change in the form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle sort button clicks
    const handleSortClick = (sortCriteria) => {
        setSortCriteria(sortCriteria);
    };

    // Function to handle year filter button clicks
    const handleYearFilterClick = (year) => {
        setYearFilter(year);
    };

    // Function to handle month filter button clicks
    const handleMonthFilterClick = (month) => {
        setMonthFilter(month);
    };

    // Filter the expenses by year and month
    let filteredExpenses = expenses;
    if (yearFilter !== "all") {
        filteredExpenses = filteredExpenses.filter(
            (expense) => expense.year === parseInt(yearFilter)
        );
    }
    if (monthFilter !== "all") {
        filteredExpenses = filteredExpenses.filter(
            (expense) => expense.month === parseInt(monthFilter)
        );
    }

    // Function to sort expenses
    const sortedExpenses = filteredExpenses.sort((a, b) => {
        if (sortCriteria === "name") {
            if (a.itemName < b.itemName) {
                return -1;
            }
            if (a.itemName > b.itemName) {
                return 1;
            }
            return 0;
        } else if (sortCriteria === "date") {
            return b.id - a.id;
        } else if (sortCriteria === "cost") {
            return b.cost - a.cost;
        } else if (sortCriteria === "category") {
            if (a.category < b.category) {
                return -1;
            }
            if (a.category > b.category) {
                return 1;
            }
            return 0;
        }
    });

    // Function to calculate the total expenses of the current table
    const totalCosts = filteredExpenses.reduce(
        (acc, expense) => acc + parseFloat(expense.cost),
        0
    );

    // Function to convert the numeric month number to string
    const handleMonth = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber);

        return date.toLocaleString("en-US", { month: "long" });
    };

    // Function to handle the pieChart data
    function updateCategoriesAmount(categories,costs) {
        let food = 0;
        let entertainment = 0;
        let other = 0;
        let shopping = 0;
        let transportation = 0;
        let housing = 0;
        let foodC = 0;
        let entertainmentC = 0;
        let otherC = 0;
        let shoppingC = 0;
        let transportationC = 0;
        let housingC = 0;

        for (let i = 0; i < categories.length; i++) {
            if (categories[i] === "Food") {
                food ++;
                foodC += costs[i];
            } else if (categories[i] === "Entertainment") {
                entertainment ++;
                entertainmentC +=costs[i];
            } else if (categories[i] === "Other") {
                other ++;
                otherC +=costs[i];
            } else if (categories[i] === "Shopping") {
                shopping ++;
                shoppingC +=costs[i];
            } else if (categories[i] === "Transportation") {
                transportation ++;
                transportationC +=costs[i];
            } else if (categories[i] === "Housing") {
                housing ++;
                housingC +=costs[i];
            }
        }
        const dataCategories = [        ["Category", "Amount"],
            ["Food", food],
            ["Entertainment", entertainment],
            ["Other", other],
            ["Shopping", shopping],
            ["Transportation", transportation],
            ["Housing", housing]
        ];

        const dataCosts = [        ["Category", "Amount"],
            ["Food", foodC],
            ["Entertainment", entertainmentC],
            ["Other", otherC],
            ["Shopping", shoppingC],
            ["Transportation", transportationC],
            ["Housing", housingC]
        ];

        return [dataCategories, dataCosts];
    }

    const categories = filteredExpenses.map(expense => expense.category);
    const costs = filteredExpenses.map(expense => parseFloat(expense.cost));

    const dataCategories = updateCategoriesAmount(categories, costs)[0];
    const dataCosts = updateCategoriesAmount(categories, costs)[1];

    // Options to the pieChart component
    const options = {
        title: "My Expenses",
        is3D: true,
        backgroundColor:"#343a40",
        textStyle: { color: 'white' },
        legend: { textStyle: { color: 'white' ,fontSize: 18 } },
        titleTextStyle: { color: 'white',  fontSize: 25},
    };

    return (
        <div
            className="container-fluid background row"
            style={{ background: "#343a40", color: "white" }}
        >
            <h1>Cost Manager</h1>
            <div className= "col-md-8">

                <form
                    onSubmit={currentExpenseId ? handleEditFormSubmit : handleFormSubmit}
                >
                    <Form.Group>
                        <Form.Label>Item Name:</Form.Label>
                        <Form.Control
                            className="form-control"
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cost:</Form.Label>
                        <Form.Control
                            className="form-control"
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category:</Form.Label>
                        <Form.Control
                            className="form-control"
                            as="select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Housing">Housing</option>
                            <option value="Other">Other</option>
                        </Form.Control>
                    </Form.Group>
                    <Button className="btn btn-success" type="submit">
                        {currentExpenseId ? "Save" : "Add"}
                    </Button>
                </form>
            </div>
            <div className="col-md-4">
                <Chart
                    chartType="PieChart"
                    data={dataCosts}
                    options={options}
                    width="110%"
                    height="340px"
                />
            </div>
            <div>
                <Button onClick={() => handleSortClick("name")}>Sort by name</Button>
                <Button onClick={() => handleSortClick("date")}>Sort by date</Button>
                <Button onClick={() => handleSortClick("cost")}>Sort by cost</Button>
                <Button onClick={() => handleSortClick("category")}>
                    Sort by category
                </Button>
                <Dropdown>
                    <br />
                    <Dropdown.Toggle>Filter by year</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleYearFilterClick("all")}>
                            Show all years
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleYearFilterClick("2023")}>
                            2023
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleYearFilterClick("2022")}>
                            2022
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleYearFilterClick("2021")}>
                            2021
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <br />
                    <Dropdown.Toggle>Filter by month</Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("all")}>
                            Show all months
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("0")}>
                            January
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("1")}>
                            February
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("2")}>
                            March
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("3")}>
                            April
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("4")}>
                            May
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("5")}>
                            June
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("6")}>
                            July
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("7")}>
                            August
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("8")}>
                            September
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("9")}>
                            October
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("10")}>
                            November
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMonthFilterClick("11")}>
                            December
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <br />
            <br />

            <Table
                className="table table-dark table-striped table-hover
                     table-bordered border-dark align-middle caption-top table-responsive"
            >
                <caption>List of expenses</caption>
                <thead className="table-dark">
                <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Item Name</th>
                    <th>Cost</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody className="table-group-divider">
                {sortedExpenses.map((expense) => (
                    <tr key={expense.id}>
                        <td>{expense.year}</td>
                        <td>{handleMonth(expense.month)}</td>
                        <td>{expense.itemName}</td>
                        <td>{expense.cost}</td>
                        <td>{expense.category}</td>
                        <td>
                            <Button
                                className="btn btn-secondary"
                                onClick={() => handleEditClick(expense.id)}
                            >
                                Edit
                            </Button>
                            <Button
                                className="btn btn-danger"
                                onClick={() => handleDeleteClick(expense.id)}
                            >
                                Delete
                            </Button>

                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={5}
                        style={{ textAlign: "center" }}
                    ><strong>Total costs: {totalCosts} ₪ </strong></td>
                    <td colSpan={1}></td>
                </tr>
                </tfoot>
            </Table>
        </div>
    );
};

export default CostManager;
