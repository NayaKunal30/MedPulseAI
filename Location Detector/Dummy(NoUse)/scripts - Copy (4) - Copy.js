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

