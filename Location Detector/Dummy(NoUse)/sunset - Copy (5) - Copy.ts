// Interface for User
interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

// Interface for Product
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

// Interface for Order
interface Order {
    id: number;
    userId: number;
    products: OrderProduct[];
    total: number;
}

// Interface for OrderProduct
interface OrderProduct {
    productId: number;
    quantity: number;
}

// Class for UserManager
class UserManager {
    private users: User[] = [];
    private userIdCounter: number = 1;

    register(username: string, email: string, password: string): User {
        const newUser: User = { id: this.userIdCounter++, username, email, password };
        this.users.push(newUser);
        console.log(`User registered: ${username}`);
        return newUser;
    }

    authenticate(username: string, password: string): User | null {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log(`User authenticated: ${username}`);
            return user;
        } else {
            console.error('Authentication failed.');
            return null;
        }
    }

    listUsers(): void {
        console.log('Registered Users:');
        this.users.forEach(user => {
            console.log(`- ${user.username} (ID: ${user.id})`);
        });
    }
}

// Class for ProductManager
class ProductManager {
    private products: Product[] = [];
    private productIdCounter: number = 1;

    addProduct(name: string, description: string, price: number, stock: number): Product {
        const newProduct: Product = { id: this.productIdCounter++, name, description, price, stock };
        this.products.push(newProduct);
        console.log(`Product added: ${name}`);
        return newProduct;
    }

    listProducts(): void {
        console.log('Available Products:');
        this.products.forEach(product => {
            console.log(`- ${product.name} (ID: ${product.id}) - Price: $${product.price} - Stock: ${product.stock}`);
        });
    }

    updateStock(productId: number, quantity: number): void {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.stock += quantity;
            console.log(`Updated stock for ${product.name}: ${product.stock}`);
        } else {
            console.error(`Product with ID ${productId} not found.`);
        }
    }

    getProduct(productId: number): Product | undefined {
        return this.products.find(p => p.id === productId);
    }
}

// Class for OrderManager
class OrderManager {
    private orders: Order[] = [];
    private orderIdCounter: number = 1;

    createOrder(userId: number, products: OrderProduct[]): Order {
        const total = products.reduce((sum, orderProduct) => {
            const product = productManager.getProduct(orderProduct.productId);
            if (product) {
                return sum + product.price * orderProduct.quantity;
            }
            return sum;
        }, 0);

        const newOrder: Order = { id: this.orderIdCounter++, userId, products, total };
        this.orders.push(newOrder);
        console.log(`Order created for User ID ${userId}: Total $${total}`);
        return newOrder;
    }

    listOrders(): void {
        console.log('Orders:');
        this.orders.forEach(order => {
            console.log(`- Order ID: ${order.id} | User ID: ${order.userId} | Total: $${order.total}`);
        });
    }

    getUserOrders(userId: number): Order[] {
        return this.orders.filter(order => order.userId === userId);
    }
}

// Class for CLI
class CLI {
    private userManager: UserManager;
    private productManager: ProductManager;
    private orderManager: OrderManager;
    private currentUser: User | null = null;

    constructor(userManager: UserManager, productManager: ProductManager, orderManager: OrderManager) {
        this.userManager = userManager;
        this.productManager = productManager;
        this.orderManager = orderManager;
    }

    start(): void {
        console.log('Welcome to the E-Commerce Application');
        this.showMainMenu();
    }

    private showMainMenu(): void {
        console.log(`
        Main Menu:
        1. Register
        2. Login
        3. List Products
        4. Exit
        `);
        this.handleMainMenuInput();
    }

    private handleMainMenuInput(): void {
        const choice = prompt('Select an option (1-4): ');
        switch (choice) {
            case '1':
                this.register();
                break;
            case '2':
                this.login();
                break;
            case '3':
                this.productManager.listProducts();
                this.showMainMenu();
                break;
            case '4':
                console.log('Exiting...');
                return;
            default:
                console.error('Invalid option, please try again.');
                this.showMainMenu();
        }
    }

    private register(): void {
        const username = prompt('Enter username: ');
        const email = prompt('Enter email: ');
        const password = prompt('Enter password: ');
        this.userManager.register(username, email, password);
        this.showMainMenu();
    }

    private login(): void {
        const username = prompt('Enter username: ');
        const password = prompt('Enter password: ');
        const user = this.userManager.authenticate(username, password);
        if (user) {
            this.currentUser = user;
            this.showUserMenu();
        } else {
            this.showMainMenu();
        }
    }

    private showUserMenu(): void {
        console.log(`
        User Menu:
        1. List Products
        2. Create Order
        3. View Orders
        4. Logout
        `);
        this.handleUserMenuInput();
    }

    private handleUserMenuInput(): void {
        const choice = prompt('Select an option (1-4): ');
        switch (choice) {
            case '1':
                this.productManager.listProducts();
                this.showUserMenu();
                break;
            case '2':
                this.createOrder();
                break;
            case '3':
                this.viewOrders();
                break;
            case '4':
                console.log('Logging out...');
                this.currentUser = null;
                this.showMainMenu();
                break;
            default:
                console.error('Invalid option, please try again.');
                this.showUserMenu();
        }
    }

    private createOrder(): void {
        if (!this.currentUser) {
            console.error('You must be logged in to create an order.');
            this.showUserMenu();
            return;
        }

        const productCount = parseInt(prompt('How many products would you like to order?'));
        const products: OrderProduct[] = [];

        for (let i = 0; i < productCount; i++) {
            const productId = parseInt(prompt('Enter product ID: '));
            const quantity = parseInt(prompt('Enter quantity: '));
            products.push({ productId, quantity });
        }

        this.orderManager.createOrder(this.currentUser.id, products);
        this.showUserMenu();
    }

    private viewOrders(): void {
        if (!this.currentUser) {
            console.error('You must be logged in to view orders.');
            this.showUserMenu();
            return;
        }

        const orders = this.orderManager.getUserOrders(this.currentUser.id);
        if (orders.length === 0) {
            console.log('No orders found for this user.');
        } else {
            console.log('Your Orders:');
            orders.forEach(order => {
                console.log(`- Order ID: ${order.id} | Total: $${order.total}`);
            });
        }
        this.showUserMenu();
    }
}

// Instantiate managers and CLI
const userManager = new UserManager();
const productManager = new ProductManager();
const orderManager = new OrderManager();
const cli = new CLI(userManager, productManager, orderManager);

// Adding products for testing
productManager.addProduct('Laptop', 'High performance laptop', 999.99, 10);
productManager.addProduct('Smartphone', 'Latest model smartphone', 599.99, 15);
productManager.addProduct('Headphones', 'Noise-canceling headphones', 199.99, 30);
productManager.addProduct('Smartwatch', 'Water-resistant smartwatch', 249.99, 20);

// Start the CLI application
cli.start();

// More functionalities to enhance the application
// Class for InventoryManager
class InventoryManager {
    private productManager: ProductManager;

    constructor(productManager: ProductManager) {
        this.productManager = productManager;
    }

    restockProduct(productId: number, quantity: number): void {
        this.productManager.updateStock(productId, quantity);
        console.log(`Product ID ${productId} restocked with ${quantity} units.`);
    }
}

// Instantiate InventoryManager
const inventoryManager = new InventoryManager(productManager);

// Example of restocking a product
inventoryManager.restockProduct(1, 5); // Restocking Laptop
inventoryManager.restockProduct(3, 10); // Restocking Headphones

// Adding a discount feature
class Discount {
    constructor(public productId: number, public percentage: number) {}

    applyDiscount(product: Product): Product {
        product.price = product.price - (product.price * (this.percentage / 100));
        console.log(`Discount of ${this.percentage}% applied to ${product.name}. New price: $${product.price}`);
        return product;
    }
}

// Apply discount to a product
const discount = new Discount(1, 10); // 10% discount on product with ID 1 (Laptop)
const laptop = productManager.getProduct(discount.productId);
if (laptop) {
    discount.applyDiscount(laptop);
}

// End of application
console.log('E-Commerce application has ended.');
