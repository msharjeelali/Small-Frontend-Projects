// IIFE to set deafult task if local storage has no data
(function () {
  if (localStorage.length == 0) {
    let containers = ["To do Tasks", "In progress Tasks"];
    localStorage.setItem(0, JSON.stringify(containers));

    tasks = [
      {
        title: "Task 1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        priority: "high",
        type: "To do Tasks",
      },
      {
        title: "Task 2",
        description:
          "Exercitationem perspiciatis explicabo quas deserunt voluptatum, assumenda unde!",
        priority: "medium",
        type: "To do Tasks",
      },
      {
        title: "Task 3",
        description:
          "Quidem quia reiciendis incidunt natus eos? Sint voluptatum soluta quo error ducimus quaerat dolor dolorum.",
        priority: "low",
        type: "To do Tasks",
      },
    ];
    for (let i = 0; i < tasks.length; i++) {
      localStorage.setItem(i + 1, JSON.stringify(tasks[i]));
    }
  }
})();

const mainContainer = document.querySelector(".container");
// Load the containers
(function () {
  let containers = JSON.parse(localStorage.getItem(0));
  let mainContainerHTML = "";
  for (let i = 0; i < containers.length; i++) {
    mainContainerHTML += `<div id='${containers[i]}' class='col' draggable='true'>
      <h2>${containers[i]}</h2>
    </div>`;
  }
  mainContainer.innerHTML = mainContainerHTML;

  // Implememt dragstart and dragend functionality on containers
  let containerList = document.querySelectorAll(".col");
  containerList.forEach((container) => {
    container.addEventListener("dragstart", () => {
      container.classList.add("dragging-container");
    });

    container.addEventListener("dragend", () => {
      container.classList.remove("dragging-container");
    });
  });
})();

const allContainers = document.querySelectorAll(".col");
// Load the tasks for each container
(function () {
  for (let i = 1; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(i));
    let select = null;
    if (task.priority == "high") {
      select = `<select onchange="changePriority(this)">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high" selected>High</option>
      </select>`;
    } else if (task.priority == "medium") {
      select = `<select onchange="changePriority(this)">
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="high">High</option>
      </select>`;
    } else if (task.priority == "low") {
      select = `<select onchange="changePriority(this)">
      <option value="low" selected>Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      </select>`;
    }
    let taskHTML = `<div class="card ${task.priority}-border" draggable="true">
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    ${select}
                    <button class="delete-task" onclick="deleteTask(this)">Del</button>
                    </div>`;

    for (let i = 0; i < allContainers.length; i++) {
      if (allContainers[i].id == task.type) {
        let taskContainerHTML = allContainers[i].innerHTML;
        taskContainerHTML += taskHTML;
        allContainers[i].innerHTML = taskContainerHTML;
      }
    }
  }

  // Implememt dragstart and dragend functionality on cards
  let taskList = document.querySelectorAll(".card");
  taskList.forEach((task) => {
    task.addEventListener("dragstart", (event) => {
      event.stopPropagation();
      task.classList.add("dragging-task");
    });

    task.addEventListener("dragend", (event) => {
      event.stopPropagation();
      task.classList.remove("dragging-task");
    });
  });
})();

// Add drag over event listener task container
allContainers.forEach((currentContainer) => {
  currentContainer.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Get current card which is being dragged
    let current = document.querySelector(".dragging-task");
    if (current) {
      // Get position where to insert car
      let appendBeforeTask = getTaskToAppendAfter(
        currentContainer,
        event.clientY
      );
      if (appendBeforeTask) {
        currentContainer.insertBefore(current, appendBeforeTask);
      } else {
        currentContainer.appendChild(current);
      }
      updateLocalStorageTask();
    }
  });
});

// Add drag over event listener to containers
mainContainer.addEventListener("dragover", (event) => {
  event.preventDefault();
  // Get current card which is being dragged
  let current = document.querySelector(".dragging-container");
  if (current) {
    // Get position where to insert card
    let appendBeforeContainer = getContainerToAppendAfter(
      mainContainer,
      event.clientX
    );
    if (appendBeforeContainer) {
      mainContainer.insertBefore(current, appendBeforeContainer);
    } else {
      mainContainer.appendChild(current);
    }
    updateLocalStorageContainer();
  }
});

// Function to update local storage when there is change in task number or order
function updateLocalStorageTask() {
  localStorage.clear();
  updateLocalStorageContainer();

  // Get all the cards, titles and description
  let cardsList = document.querySelectorAll(".card");
  let cardsTitle = document.querySelectorAll(".card h3");
  let cardsDescription = document.querySelectorAll(".card p");
  let cardsPriority = document.querySelectorAll(".card select");

  for (let i = 0; i < cardsList.length; i++) {
    let obj = {
      title: cardsTitle[i].innerText,
      description: cardsDescription[i].innerText,
      priority: cardsPriority[i].value,
      // Check if task is of to do type or in progress type
      type: cardsList[i].parentElement.id,
    };
    localStorage.setItem(i + 1, JSON.stringify(obj));
  }
}

// Function to update local storage when there is change in task container or thier order
function updateLocalStorageContainer() {
  // Get all the cards, titles and description
  let containersList = document.querySelectorAll(".col");
  let containersArray = [];
  for (let i = 0; i < containersList.length; i++) {
    containersArray.push(containersList[i].id);
  }
  localStorage.setItem(0, JSON.stringify(containersArray));
}

// Function that return nearest card node from current mouse position
function getTaskToAppendAfter(currentList, mousePosition) {
  let tasksList = [
    ...currentList.querySelectorAll(".card:not(.dragging-task)"),
  ];

  let closetOffset = Number.NEGATIVE_INFINITY;
  let closetTask = undefined;

  // For every card in list
  for (let task of tasksList) {
    // Calculate offset
    let boundry = task.getBoundingClientRect();
    let currentOffset = mousePosition - boundry.top - boundry.height / 2;

    if (currentOffset < 0 && currentOffset > closetOffset) {
      closetOffset = currentOffset;
      closetTask = task;
    }
  }

  return closetTask;
}

// Function that return nearest container node from current mouse position
function getContainerToAppendAfter(currentList, mousePosition) {
  let containersList = [
    ...currentList.querySelectorAll(".col:not(.dragging-container)"),
  ];

  let closetOffset = Number.NEGATIVE_INFINITY;
  let closetContainer = undefined;

  // For every card in list
  for (let conatianer of containersList) {
    // Calculate offset
    let boundry = conatianer.getBoundingClientRect();
    let currentOffset = mousePosition - boundry.left - boundry.width / 2;

    if (currentOffset < 0 && currentOffset > closetOffset) {
      closetOffset = currentOffset;
      closetContainer = conatianer;
    }
  }

  return closetContainer;
}

const newTaskForm = document.getElementById("add-new-task");
const newContainerForm = document.getElementById("add-new-container");

// Function to show new task form
function showNewTaskForm() {
  newTaskForm.style.display = "block";
}

// Function to show new conatianer form
function showNewContainerForm() {
  newContainerForm.style.display = "block";
}

// Function to hide new task form
function hideNewTaskForm() {
  newTaskForm.style.display = "none";
}

// Function to hide new container form
function hideNewContainerForm() {
  newContainerForm.style.display = "none";
}

// Function that prevent default form submission action i.e. reload on submit
function handleSubmit(event) {
  event.preventDefault();
}

// Function to add new task in to do task list
function addNewTask() {
  const taskTitle = document.getElementById("task-title").value.trim();
  const taskDescription = document
    .getElementById("task-description")
    .value.trim();
  const taskPriority = document.getElementById("task-priority").value;

  if (!taskTitle && !taskDescription) {
    alert("Both title and description cannot be empty!");
    return;
  }
  if (!taskTitle) {
    alert("Task title cannot be empty!");
    return;
  }
  if (!taskDescription) {
    alert("Task description cannot be empty!");
    return;
  }
  if (taskTitle.length > 50) {
    alert("Task title cannot be longer than 50 characters!");
    return;
  }
  if (taskDescription.length > 200) {
    alert("Task description cannot be longer than 200 characters!");
    return;
  }
  if (!["low", "medium", "high"].includes(taskPriority)) {
    alert("Please select a valid priority!");
    return;
  }

  let newTask = document.createElement("div");
  newTask.classList.add("card", `${taskPriority}-border`);
  newTask.setAttribute("draggable", "true");
  newTask.innerHTML = `<h3>${taskTitle}</h3>
                      <p>${taskDescription}</p>
                     <select onchange="changePriority(this)">
                          <option value="low" ${
                            taskPriority === "low" ? "selected" : ""
                          }>Low</option>
                          <option value="medium" ${
                            taskPriority === "medium" ? "selected" : ""
                          }>Medium</option>
                          <option value="high" ${
                            taskPriority === "high" ? "selected" : ""
                          }>High</option>
                      </select>
                      <button class="delete-task" onclick="deleteTask(this)">Del</button>`;

  for (let i = 0; i < allContainers.length; i++) {
    if (allContainers[i].id == "To do Tasks") {
      allContainers[i].insertAdjacentElement("beforeend", newTask);
    }
  }

  // Implement dragstart and dragend to new inserted card
  newTask.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    newTask.classList.add("dragging-task");
  });
  newTask.addEventListener("dragend", (event) => {
    event.stopPropagation();
    newTask.classList.remove("dragging-task");
  });

  newTaskForm.style.display = "none";
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  updateLocalStorageTask();
}

// Function to add new container
function addNewContainer() {
  const containerTitle = document.getElementById("container-title").value;
  if (!containerTitle) {
    alert("Container title cannot be empty!");
    return;
  }
  if (containerTitle.length > 30) {
    alert("Container title cannot be longer than 30 characters!");
    return;
  }
  // Check for duplicate container titles
  const existingContainers = Array.from(allContainers).map((container) =>
    container.id.toLowerCase()
  );
  if (existingContainers.includes(containerTitle.toLowerCase())) {
    alert("A container with this title already exists!");
    return;
  }

  let newContainer = document.createElement("div");
  newContainer.classList.add("col");
  newContainer.id = containerTitle;
  newContainer.setAttribute("draggable", "true");
  newContainer.innerHTML = `<h2>${containerTitle}</h2>`;
  mainContainer.insertAdjacentElement("beforeend", newContainer);

  // Functionality to move between containers
  newContainer.addEventListener("dragstart", () => {
    newContainer.classList.add("dragging-container");
  });

  newContainer.addEventListener("dragend", () => {
    newContainer.classList.remove("dragging-container");
  });

  // Functionality to move task within container
  newContainer.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Get current container which is being dragged
    let current = document.querySelector(".dragging-task");
    if (current) {
      // Get position where to insert card
      let appendBeforeTask = getTaskToAppendAfter(newContainer, event.clientY);
      if (appendBeforeTask) {
        newContainer.insertBefore(current, appendBeforeTask);
      } else {
        newContainer.appendChild(current);
      }
      updateLocalStorageTask();
    }
  });

  newContainerForm.style.display = "none";
  document.getElementById("container-title").value = "";
  updateLocalStorageContainer();
}

// Function to delete task from list
function deleteTask(element) {
  let parentContainer = element.parentElement.parentElement;
  let parentCard = element.parentElement;

  parentContainer.removeChild(parentCard);
  updateLocalStorageTask();
}

// Function to update border based on priority changed
function changePriority(selectedElement) {
  if (selectedElement.value == "high") {
    selectedElement.parentElement.classList.add("high-border");
    selectedElement.parentElement.classList.remove("medium-border");
    selectedElement.parentElement.classList.remove("low-border");
  } else if (selectedElement.value == "medium") {
    selectedElement.parentElement.classList.remove("high-border");
    selectedElement.parentElement.classList.add("medium-border");
    selectedElement.parentElement.classList.remove("low-border");
  } else if (selectedElement.value == "low") {
    selectedElement.parentElement.classList.remove("high-border");
    selectedElement.parentElement.classList.remove("medium-border");
    selectedElement.parentElement.classList.add("low-border");
  }

  updateLocalStorageTask();
}
