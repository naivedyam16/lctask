// Firebase Configuration 
const firebaseConfig = {
  apiKey: 
  authDomain: 
  projectId: 
  storageBucket: 
  messagingSenderId: 
  appId: 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to the sections
const homepageSection = document.getElementById('homepage');
const completedTasksSection = document.getElementById('completed-tasks');
const pendingTasksSection = document.getElementById('pending-tasks');

// Function to show the selected section and hide others
function showSection(sectionToShow) {
  homepageSection.style.display = 'none';
  completedTasksSection.style.display = 'none';
  pendingTasksSection.style.display = 'none';

  sectionToShow.style.display = 'block';
}

// Add Task
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
addTaskBtn.addEventListener('click', function() {
  const task = taskInput.value;
  const timestamp = Date.now();

  if (task.trim() !== '') {
    const taskData = {
      task: task,
      timestamp: timestamp
    };

    database.ref('tasks').push(taskData);
    taskInput.value = '';
  }
});

// Load Tasks
const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');
const pendingTaskList = document.getElementById('pending-task-list');

function loadTasks() {
  taskList.innerHTML = '';
  completedTaskList.innerHTML = '';
  pendingTaskList.innerHTML = '';

  database.ref('tasks').on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      const taskData = childSnapshot.val();
      const taskId = childSnapshot.key;
      const task = taskData.task;
      const timestamp = taskData.timestamp;

      const listItem = document.createElement('li');
      listItem.innerHTML = 
        <span>${task}</span>
        <span class="task-timestamp">${formatTimestamp(timestamp)}</span>
        <button class="edit-task-btn" onclick="editTask('${taskId}')">Edit</button>
        <button class="delete-task-btn" onclick="deleteTask('${taskId}')">Delete</button>
      ;

      if (isTaskCompleted(timestamp)) {
        completedTaskList.appendChild(listItem);
      } else {
        pendingTaskList.appendChild(listItem);
      }
    });
  });
}

// Format timestamp to display as date and time
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Check if a task is completed (time taken > 5 minutes)
function isTaskCompleted(timestamp) {
  const currentTime = Date.now();
  return currentTime - timestamp > 300000; // 5 minutes in milliseconds
}

// Edit Task
function editTask(taskId) {
  const newTask = prompt('Enter the new task:');
  if (newTask !== null && newTask.trim() !== '') {
    const taskData = {
      task: newTask,
      timestamp: Date.now()
    };
    database.ref(tasks/${taskId}).set(taskData);
  }
}

// Delete Task
function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    database.ref(tasks/${taskId}).remove();
  }
}

// Navigation Event Listeners
const homepageLink = document.querySelector('a[href="#homepage"]');
homepageLink.addEventListener('click', function(event) {
event.preventDefault();
showSection(homepageSection);
});

const completedTasksLink = document.querySelector('a[href="#completed-tasks"]');
completedTasksLink.addEventListener('click', function(event) {
event.preventDefault();
showSection(completedTasksSection);
});

const pendingTasksLink = document.querySelector('a[href="#pending-tasks"]');
pendingTasksLink.addEventListener('click', function(event) {
event.preventDefault();
showSection(pendingTasksSection);
});

// Initial page load
window.addEventListener('load', function() {
  showSection(homepageSection);
  loadTasks();
  });
