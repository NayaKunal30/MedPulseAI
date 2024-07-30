// User class to represent a user
class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.projects = [];
    }
}

// Task class to represent a task
class Task {
    constructor(id, title, description, status = 'pending') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        this.updatedAt = new Date();
    }
}

// Project class to represent a project
class Project {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    listTasks() {
        console.log(`Tasks for Project: ${this.name}`);
        this.tasks.forEach(task => {
            console.log(`- [${task.status}] ${task.title}: ${task.description}`);
        });
    }
}

// UserManager to handle user registration and authentication
class UserManager {
    constructor() {
        this.users = [];
        this.userIdCounter = 1;
    }

    register(username, email, password) {
        const newUser = new User(this.userIdCounter++, username, email, password);
        this.users.push(newUser);
        console.log(`User registered: ${username}`);
        return newUser;
    }

    authenticate(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log(`User authenticated: ${username}`);
            return user;
        } else {
            console.error('Authentication failed.');
            return null;
        }
    }
}

// TaskManager to manage tasks and projects
class TaskManager {
    constructor() {
        this.projects = [];
        this.projectIdCounter = 1;
        this.taskIdCounter = 1;
    }

    createProject(name) {
        const newProject = new Project(this.projectIdCounter++, name);
        this.projects.push(newProject);
        console.log(`Project created: ${name}`);
        return newProject;
    }

    addTaskToProject(projectId, title, description) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const newTask = new Task(this.taskIdCounter++, title, description);
            project.addTask(newTask);
            console.log(`Task added to project ${project.name}: ${title}`);
            return newTask;
        } else {
            console.error(`Project with ID ${projectId} not found.`);
            return null;
        }
    }

    listProjects() {
        console.log('Projects:');
        this.projects.forEach(project => {
            console.log(`- ${project.name} (ID: ${project.id})`);
        });
    }

    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }
}

// CLI interface to interact with the task management system
class CLI {
    constructor(userManager, taskManager) {
        this.userManager = userManager;
        this.taskManager = taskManager;
        this.currentUser = null;
    }

    start() {
        console.log('Welcome to the Task Management Application');
        this.showMainMenu();
    }

    showMainMenu() {
        console.log(`
        Main Menu:
        1. Register
        2. Login
        3. Exit
        `);
        this.handleMainMenuInput();
    }

    handleMainMenuInput() {
        const choice = prompt('Select an option (1-3): ');
        switch (choice) {
            case '1':
                this.register();
                break;
            case '2':
                this.login();
                break;
            case '3':
                console.log('Exiting...');
                return;
            default:
                console.error('Invalid option, please try again.');
                this.showMainMenu();
        }
    }

    register() {
        const username = prompt('Enter username: ');
        const email = prompt('Enter email: ');
        const password = prompt('Enter password: ');
        this.userManager.register(username, email, password);
        this.showMainMenu();
    }

    login() {
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

    showUserMenu() {
        console.log(`
        User Menu:
        1. Create Project
        2. List Projects
        3. Exit
        `);
        this.handleUserMenuInput();
    }

    handleUserMenuInput() {
        const choice = prompt('Select an option (1-3): ');
        switch (choice) {
            case '1':
                this.createProject();
                break;
            case '2':
                this.listProjects();
                break;
            case '3':
                console.log('Logging out...');
                this.currentUser = null;
                this.showMainMenu();
                break;
            default:
                console.error('Invalid option, please try again.');
                this.showUserMenu();
        }
    }

    createProject() {
        const name = prompt('Enter project name: ');
        const project = this.taskManager.createProject(name);
        this.currentUser.projects.push(project);
        this.showUserMenu();
    }

    listProjects() {
        console.log('Your Projects:');
        this.currentUser.projects.forEach(project => {
            console.log(`- ${project.name} (ID: ${project.id})`);
        });
        this.showUserMenu();
    }

    addTaskToProject() {
        const projectId = prompt('Enter project ID to add a task: ');
        const title = prompt('Enter task title: ');
        const description = prompt('Enter task description: ');
        const task = this.taskManager.addTaskToProject(parseInt(projectId), title, description);
        if (task) {
            console.log(`Task added: ${task.title}`);
        }
        this.showUserMenu();
    }

    listTasksInProject() {
        const projectId = prompt('Enter project ID to list tasks: ');
        const project = this.taskManager.getProject(parseInt(projectId));
        if (project) {
            project.listTasks();
        } else {
            console.error(`Project with ID ${projectId} not found.`);
        }
        this.showUserMenu();
    }
}

// Instantiate classes
const userManager = new UserManager();
const taskManager = new TaskManager();
const cli = new CLI(userManager, taskManager);

// Start the CLI application
cli.start();

// Adding more functionalities to extend the application
User.prototype.viewProjects = function() {
    console.log(`Projects for ${this.username}:`);
    this.projects.forEach(project => {
        console.log(`- ${project.name} (ID: ${project.id})`);
    });
};

Project.prototype.viewTasks = function() {
    console.log(`Tasks in project: ${this.name}`);
    if (this.tasks.length === 0) {
        console.log('No tasks in this project.');
    } else {
        this.tasks.forEach(task => {
            console.log(`- [${task.status}] ${task.title}: ${task.description}`);
        });
    }
};

// Extend CLI with additional options
CLI.prototype.showUserMenu = function() {
    console.log(`
    User Menu:
    1. Create Project
    2. List Projects
    3. Add Task to Project
    4. List Tasks in Project
    5. Exit
    `);
    this.handleUserMenuInput();
};

CLI.prototype.handleUserMenuInput = function() {
    const choice = prompt('Select an option (1-5): ');
    switch (choice) {
        case '1':
            this.createProject();
            break;
        case '2':
            this.listProjects();
            break;
        case '3':
            this.addTaskToProject();
            break;
        case '4':
            this.listTasksInProject();
            break;
        case '5':
            console.log('Logging out...');
            this.currentUser = null;
            this.showMainMenu();
            break;
        default:
            console.error('Invalid option, please try again.');
            this.showUserMenu();
    }
};

// Further functionalities to improve the application
Task.prototype.updateTaskDetails = function(newTitle, newDescription) {
    if (newTitle) {
        this.title = newTitle;
    }
    if (newDescription) {
        this.description = newDescription;
    }
    console.log(`Task updated: ${this.title}`);
};

CLI.prototype.updateTask = function() {
    const projectId = prompt('Enter project ID to update task: ');
    const taskId = prompt('Enter task ID to update: ');
    const project = this.taskManager.getProject(parseInt(projectId));
    if (project) {
        const task = project.tasks.find(t => t.id === parseInt(taskId));
        if (task) {
            const newTitle = prompt('Enter new task title (leave blank to skip): ');
            const newDescription = prompt('Enter new task description (leave blank to skip): ');
            task.updateTaskDetails(newTitle, newDescription);
        } else {
            console.error(`Task with ID ${taskId} not found.`);
        }
    } else {
        console.error(`Project with ID ${projectId} not found.`);
    }
    this.showUserMenu();
};

// Adding task removal functionality
TaskManager.prototype.removeTaskFromProject = function(projectId, taskId) {
    const project = this.getProject(projectId);
    if (project) {
        project.removeTask(taskId);
        console.log(`Task ID ${taskId} removed from project ${project.name}.`);
    } else {
        console.error(`Project with ID ${projectId} not found.`);
    }
};

// Adding CLI option to remove tasks
CLI.prototype.removeTask = function() {
    const projectId = prompt('Enter project ID to remove task: ');
    const taskId = prompt('Enter task ID to remove: ');
    this.taskManager.removeTaskFromProject(parseInt(projectId), parseInt(taskId));
    this.showUserMenu();
};

// Adding exit functionality to CLI
CLI.prototype.exitApplication = function() {
    console.log('Exiting the application. Goodbye!');
};

// Test cases
const testUser = userManager.register('testUser', 'test@example.com', 'testPassword');
const testProject = taskManager.createProject('Test Project');
taskManager.addTaskToProject(testProject.id, 'Test Task', 'This is a test task description.');
taskManager.addTaskToProject(testProject.id, 'Another Task', 'Another task description.');

testUser.viewProjects();
testProject.viewTasks();