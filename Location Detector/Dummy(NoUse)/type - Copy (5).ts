// Interfaces for User and Task
interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
}

interface ITask {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

// User class implementing IUser interface
class User implements IUser {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string
    ) {}
}

// Task class implementing ITask interface
class Task implements ITask {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public status: 'pending' | 'in-progress' | 'completed',
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}

// UserManager to manage users
class UserManager {
    private users: User[] = [];
    private userIdCounter: number = 1;

    register(username: string, email: string, password: string): User {
        const newUser = new User(this.userIdCounter++, username, email, password);
        this.users.push(newUser);
        console.log(`User registered: ${username}`);
        return newUser;
    }

    findUserByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }

    listUsers(): void {
        console.log("Registered Users:");
        this.users.forEach(user => {
            console.log(`- ${user.username}`);
        });
    }
}

// TaskManager to manage tasks
class TaskManager {
    private tasks: Task[] = [];
    private taskIdCounter: number = 1;

    createTask(title: string, description: string): Task {
        const newTask = new Task(
            this.taskIdCounter++,
            title,
            description,
            'pending',
            new Date(),
            new Date()
        );
        this.tasks.push(newTask);
        console.log(`Task created: ${title}`);
        return newTask;
    }

    updateTask(id: number, title?: string, description?: string, status?: 'pending' | 'in-progress' | 'completed'): Task | undefined {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            if (title) task.title = title;
            if (description) task.description = description;
            if (status) task.status = status;
            task.updatedAt = new Date();
            console.log(`Task updated: ${task.title}`);
            return task;
        } else {
            console.error(`Task with ID ${id} not found.`);
        }
    }

    deleteTask(id: number): boolean {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            console.log(`Task with ID ${id} deleted.`);
            return true;
        } else {
            console.error(`Task with ID ${id} not found.`);
            return false;
        }
    }

    listTasks(): void {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }
        console.log("Tasks:");
        this.tasks.forEach(task => {
            console.log(`- [${task.status}] ${task.title}: ${task.description}`);
        });
    }

    getTaskById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }
}

// Authentication class for user login
class Auth {
    private loggedInUser: User | null = null;

    login(username: string, password: string, userManager: UserManager): boolean {
        const user = userManager.findUserByUsername(username);
        if (user && user.password === password) {
            this.loggedInUser = user;
            console.log(`${username} logged in successfully.`);
            return true;
        } else {
            console.error("Invalid username or password.");
            return false;
        }
    }

    logout(): void {
        if (this.loggedInUser) {
            console.log(`${this.loggedInUser.username} logged out.`);
            this.loggedInUser = null;
        } else {
            console.log("No user is currently logged in.");
        }
    }

    getCurrentUser(): User | null {
        return this.loggedInUser;
    }
}

// Example usage of the Task Management System
const userManager = new UserManager();
const taskManager = new TaskManager();
const auth = new Auth();

// Register users
const user1 = userManager.register("alice", "alice@example.com", "password123");
const user2 = userManager.register("bob", "bob@example.com", "securepassword");

// List users
userManager.listUsers();

// User login
auth.login("alice", "password123", userManager);
auth.login("bob", "wrongpassword", userManager);

// Create tasks
const task1 = taskManager.createTask("Task 1", "Description for task 1");
const task2 = taskManager.createTask("Task 2", "Description for task 2");

// List tasks
taskManager.listTasks();

// Update a task
taskManager.updateTask(task1.id, "Updated Task 1", "Updated description for task 1", "in-progress");

// List tasks after update
taskManager.listTasks();

// Delete a task
taskManager.deleteTask(task2.id);

// List tasks after deletion
taskManager.listTasks();

// User logout
auth.logout();

// User login with non-existing user
auth.login("nonexistent", "password", userManager);

// TaskManager test cases
// Attempt to update a non-existing task
taskManager.updateTask(999, "Task 999", "Description", "pending");

// Attempt to delete a non-existing task
taskManager.deleteTask(999);

// UserManager test cases
// Attempt to register a user with an existing username
userManager.register("alice", "alice@example.com", "newpassword");

// Task creation with unique titles
taskManager.createTask("Unique Task 1", "Description for unique task 1");
taskManager.createTask("Unique Task 2", "Description for unique task 2");

// Test task listing and retrieving tasks
taskManager.listTasks();
const retrievedTask = taskManager.getTaskById(task1.id);
if (retrievedTask) {
    console.log(`Retrieved Task: ${retrievedTask.title} - ${retrievedTask.description}`);
} else {
    console.log("Task not found.");
}

// Additional functionality for filtering tasks
class ExtendedTaskManager extends TaskManager {
    filterTasksByStatus(status: 'pending' | 'in-progress' | 'completed'): Task[] {
        return this.tasks.filter(task => task.status === status);
    }

    listFilteredTasks(status: 'pending' | 'in-progress' | 'completed'): void {
        const filteredTasks = this.filterTasksByStatus(status);
        if (filteredTasks.length === 0) {
            console.log(`No tasks found with status: ${status}`);
            return;
        }
        console.log(`Tasks with status "${status}":`);
        filteredTasks.forEach(task => {
            console.log(`- [${task.status}] ${task.title}: ${task.description}`);
        });
    }
}

// Create an instance of ExtendedTaskManager
const extendedTaskManager = new ExtendedTaskManager();

// Add some tasks
extendedTaskManager.createTask("Pending Task 1", "Pending task description");
extendedTaskManager.createTask("In Progress Task 1", "Task in progress description");
extendedTaskManager.createTask("Completed Task 1", "Completed task description");

// List all tasks
extendedTaskManager.listTasks();

// List tasks by status
extendedTaskManager.listFilteredTasks('pending');
extendedTaskManager.listFilteredTasks('in-progress');
extendedTaskManager.listFilteredTasks('completed');

// Further task management functionality
extendedTaskManager.updateTask(1, undefined, undefined, 'completed'); // Update to completed
extendedTaskManager.listTasks(); // List tasks to see updated status

// Logout user after completing tasks
auth.logout();

// Attempt to perform actions without a logged-in user
taskManager.listTasks();
taskManager.updateTask(1, "New Title", "New Description", "pending");
