// A simple JavaScript program to manage a library system with user authentication

// Define a Book class
class Book {
    constructor(title, author, genre, year) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.isCheckedOut = false;
    }

    checkOut() {
        this.isCheckedOut = true;
    }

    returnBook() {
        this.isCheckedOut = false;
    }

    getDetails() {
        return `${this.title} by ${this.author}, Genre: ${this.genre}, Year: ${this.year}, Available: ${!this.isCheckedOut}`;
    }
}

// Define a Library class
class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
        this.saveBooks();
    }

    removeBook(title) {
        const bookIndex = this.books.findIndex(book => book.title === title);
        if (bookIndex !== -1) {
            this.books.splice(bookIndex, 1);
            this.saveBooks();
        } else {
            console.error(`Book titled "${title}" not found.`);
        }
    }

    listBooks() {
        return this.books.map(book => book.getDetails()).join('\n');
    }

    findBook(title) {
        return this.books.find(book => book.title === title);
    }

    searchBooks(query) {
        return this.books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
    }

    saveBooks() {
        localStorage.setItem('libraryBooks', JSON.stringify(this.books));
    }

    loadBooks() {
        const booksData = localStorage.getItem('libraryBooks');
        if (booksData) {
            this.books = JSON.parse(booksData).map(bookData => new Book(bookData.title, bookData.author, bookData.genre, bookData.year));
        }
    }
}

// Define a User class
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

// Define an Authentication class
class Authentication {
    constructor() {
        this.users = [];
        this.currentUser = null;
    }

    register(username, password) {
        const existingUser = this.users.find(user => user.username === username);
        if (existingUser) {
            console.error("Username already exists.");
            return false;
        }
        const newUser = new User(username, password);
        this.users.push(newUser);
        this.saveUsers();
        console.log("User registered successfully.");
        return true;
    }

    login(username, password) {
        const user = this.users.find(user => user.username === username && user.password === password);
        if (user) {
            this.currentUser = user;
            console.log(`Welcome, ${this.currentUser.username}!`);
            return true;
        }
        console.error("Invalid username or password.");
        return false;
    }

    logout() {
        this.currentUser = null;
        console.log("Logged out successfully.");
    }

    saveUsers() {
        localStorage.setItem('libraryUsers', JSON.stringify(this.users));
    }

    loadUsers() {
        const usersData = localStorage.getItem('libraryUsers');
        if (usersData) {
            this.users = JSON.parse(usersData).map(userData => new User(userData.username, userData.password));
        }
    }
}

// Create new instances of Library and Authentication
const myLibrary = new Library();
const authSystem = new Authentication();

// Load saved books and users from local storage
myLibrary.loadBooks();
authSystem.loadUsers();

// Add initial books to the library if it's empty
if (myLibrary.books.length === 0) {
    myLibrary.addBook(new Book("To Kill a Mockingbird", "Harper Lee", "Fiction", 1960));
    myLibrary.addBook(new Book("1984", "George Orwell", "Dystopian", 1949));
    myLibrary.addBook(new Book("The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 1925));
    myLibrary.addBook(new Book("Moby Dick", "Herman Melville", "Adventure", 1851));
}

// Function to check out a book
function checkOutBook(title) {
    const book = myLibrary.findBook(title);
    if (book && !book.isCheckedOut) {
        book.checkOut();
        console.log(`Checked out: ${book.getDetails()}`);
    } else {
        console.error("Book is already checked out or does not exist.");
    }
}

// Function to return a book
function returnBook(title) {
    const book = myLibrary.findBook(title);
    if (book && book.isCheckedOut) {
        book.returnBook();
        console.log(`Returned: ${book.getDetails()}`);
    } else {
        console.error("Book was not checked out or does not exist.");
    }
}

// Fetch book data asynchronously (dummy data)
async function fetchBookData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", year: 1951 },
                { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: 1813 },
            ]);
        }, 2000);
    });
}

// Fetch and add books to the library
async function addBooksFromAPI() {
    console.log("Fetching book data...");
    const booksData = await fetchBookData();
    booksData.forEach(bookData => {
        const book = new Book(bookData.title, bookData.author, bookData.genre, bookData.year);
        myLibrary.addBook(book);
    });
    console.log("Books added from API:");
    console.log(myLibrary.listBooks());
}

// Add event listeners for the DOM
document.addEventListener("DOMContentLoaded", () => {
    const bookListElement = document.getElementById("book-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");

    // Display initial books
    bookListElement.innerHTML = myLibrary.listBooks().replace(/\n/g, "<br>");

    // Search functionality
    searchButton.addEventListener("click", () => {
        const query = searchInput.value;
        const results = myLibrary.searchBooks(query);
        if (results.length > 0) {
            bookListElement.innerHTML = results.map(book => book.getDetails()).join('<br>');
        } else {
            bookListElement.innerHTML = "No books found.";
        }
    });

    // Register functionality
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        authSystem.register(username, password);
        e.target.reset();
    });

    // Login functionality
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        authSystem.login(username, password);
        e.target.reset();
    });

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        authSystem.logout();
    });

    // Add books from API
    addBooksFromAPI();
});

// Additional function to display book details in the console
function displayBookDetails(title) {
    const book = myLibrary.findBook(title);
    if (book) {
        console.log(book.getDetails());
    } else {
        console.error(`Book titled "${title}" not found.`);
    }
}

// Usage examples
checkOutBook("1984");
returnBook("1984");
displayBookDetails("The Great Gatsby");

// E-Commerce Platform Simulation

// Define a Product class
class Product {
    constructor(id, name, description, price, category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.stock = 0;
    }

    addStock(amount) {
        this.stock += amount;
    }

    removeStock(amount) {
        if (amount > this.stock) {
            console.error(`Cannot remove ${amount} from stock. Only ${this.stock} available.`);
            return;
        }
        this.stock -= amount;
    }

    getDetails() {
        return `${this.name} - ${this.description} | Price: $${this.price} | Stock: ${this.stock}`;
    }
}

// Define a User class
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.cart = [];
    }

    addToCart(product) {
        this.cart.push(product);
        console.log(`${product.name} added to cart.`);
    }

    viewCart() {
        if (this.cart.length === 0) {
            console.log("Your cart is empty.");
            return;
        }
        console.log("Your Cart:");
        this.cart.forEach(product => {
            console.log(product.getDetails());
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            console.log("Your cart is empty. Please add items to your cart before checking out.");
            return;
        }
        const total = this.cart.reduce((sum, product) => sum + product.price, 0);
        console.log(`Your total is $${total}. Thank you for your purchase!`);
        this.cart = []; // Clear the cart after checkout
    }
}

// Define an Order class
class Order {
    constructor(user, products) {
        this.user = user;
        this.products = products;
        this.orderDate = new Date();
        this.status = 'Pending';
    }

    getOrderDetails() {
        return `Order for ${this.user.username} on ${this.orderDate.toLocaleString()} | Status: ${this.status}`;
    }
}

// Define a ShoppingCart class
class ShoppingCart {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
        console.log(`${product.name} added to shopping cart.`);
    }

    removeProduct(productId) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            const removedProduct = this.products.splice(productIndex, 1);
            console.log(`${removedProduct[0].name} removed from shopping cart.`);
        } else {
            console.error("Product not found in shopping cart.");
        }
    }

    viewCart() {
        if (this.products.length === 0) {
            console.log("Your shopping cart is empty.");
            return;
        }
        console.log("Shopping Cart:");
        this.products.forEach(product => {
            console.log(product.getDetails());
        });
    }

    calculateTotal() {
        return this.products.reduce((sum, product) => sum + product.price, 0);
    }
}

// Define an Inventory class
class Inventory {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
        console.log(`${product.name} added to inventory.`);
    }

    removeProduct(productId) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            console.log(`Product with ID ${productId} removed from inventory.`);
        } else {
            console.error("Product not found in inventory.");
        }
    }

    listProducts() {
        if (this.products.length === 0) {
            console.log("No products available.");
            return;
        }
        console.log("Available Products:");
        this.products.forEach(product => {
            console.log(product.getDetails());
        });
    }

    findProductById(productId) {
        return this.products.find(product => product.id === productId);
    }
}

// Define a UserManager class
class UserManager {
    constructor() {
        this.users = [];
    }

    registerUser(username, email) {
        const existingUser = this.users.find(user => user.username === username);
        if (existingUser) {
            console.error("Username already exists. Choose a different username.");
            return;
        }
        const newUser = new User(username, email);
        this.users.push(newUser);
        console.log(`User ${username} registered successfully.`);
    }

    findUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    listUsers() {
        if (this.users.length === 0) {
            console.log("No users registered.");
            return;
        }
        console.log("Registered Users:");
        this.users.forEach(user => {
            console.log(user.username);
        });
    }
}

// Define a PaymentProcessor class
class PaymentProcessor {
    processPayment(amount) {
        console.log(`Processing payment of $${amount}...`);
        // Simulate payment processing
        setTimeout(() => {
            console.log("Payment processed successfully.");
        }, 2000);
    }
}

// Create instances of classes
const inventory = new Inventory();
const userManager = new UserManager();
const paymentProcessor = new PaymentProcessor();

// Add some products to the inventory
const product1 = new Product(1, "Laptop", "A high-performance laptop", 999.99, "Electronics");
const product2 = new Product(2, "Smartphone", "A latest model smartphone", 799.99, "Electronics");
const product3 = new Product(3, "Headphones", "Noise-cancelling headphones", 199.99, "Accessories");
const product4 = new Product(4, "Coffee Maker", "Brews delicious coffee", 49.99, "Home Appliances");

product1.addStock(10);
product2.addStock(20);
product3.addStock(15);
product4.addStock(5);

inventory.addProduct(product1);
inventory.addProduct(product2);
inventory.addProduct(product3);
inventory.addProduct(product4);

// List products in the inventory
inventory.listProducts();

// Register users
userManager.registerUser("john_doe", "john@example.com");
userManager.registerUser("jane_smith", "jane@example.com");

// List registered users
userManager.listUsers();

// User actions
const user = userManager.findUserByUsername("john_doe");
if (user) {
    user.addToCart(product1);
    user.addToCart(product2);
    user.viewCart();
    const total = user.cart.reduce((sum, product) => sum + product.price, 0);
    paymentProcessor.processPayment(total);
    user.checkout();
}

// Simulate an order
const order = new Order(user, user.cart);
console.log(order.getOrderDetails());

// User actions after checkout
user.viewCart();

// Create a new user and add products to cart
const newUser = new User("alice", "alice@example.com");
newUser.addToCart(product3);
newUser.viewCart();
paymentProcessor.processPayment(newUser.cart.reduce((sum, product) => sum + product.price, 0));
newUser.checkout();

// Inventory operations
inventory.listProducts();
inventory.removeProduct(2); // Remove smartphone
inventory.listProducts(); // List remaining products

// Simulate stock management
product1.removeStock(3); // Sell 3 laptops
console.log(`Stock of laptops after sale: ${product1.stock}`);
product1.addStock(5); // Add 5 more laptops
console.log(`Stock of laptops after restock: ${product1.stock}`);

// List products after stock changes
inventory.listProducts();

// Search for a product
const searchedProduct = inventory.findProductById(1);
if (searchedProduct) {
    console.log("Found product:");
    console.log(searchedProduct.getDetails());
} else {
    console.log("Product not found.");
}

// User management functionalities
userManager.listUsers(); // List users
userManager.registerUser("john_doe", "john@example.com"); // Attempt to register existing user

// Simulate payment processing with callback
paymentProcessor.processPayment(150.00);

// Additional simulated user interactions
const anotherUser = new User("bob", "bob@example.com");
anotherUser.addToCart(product4);
anotherUser.viewCart();
anotherUser.checkout();

// Final Inventory state
inventory.listProducts(); // Final state of products in inventory
