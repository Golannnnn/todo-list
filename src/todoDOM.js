import { format } from "date-fns";
import { todo } from "./todo.js";
import { today } from "./today.js";
import { upcoming } from "./upcoming.js";
import { projectLogic } from "./project.js";

const todoDOM = (() => {
  const container = document.querySelector("#todo-container");
  const projects = document.querySelector("#dynamic-projects");
  const mainTitle = document.querySelector("#main-title");

  const clearContent = () => {
    while (container.childNodes.length > 4) {
      container.removeChild(container.lastChild);
    }
  };

  const editTodoHandler = (el) => {
    const spanList = el.parentNode.getElementsByTagName("span");
    const thisId = Number(el.parentNode.dataset.id);
    const filtered = todo.array.filter((obj) => obj.id === thisId);

    for (let i = 0; i < spanList.length; i += 1) {
      const input = document.createElement("input");

      if (spanList[i].className === "date") {
        input.setAttribute("type", "date");
        input.setAttribute("value", filtered[0].date);
      } else if (spanList[i].className === "priority") {
        input.setAttribute("type", "checkbox");
        if (spanList[i].textContent === "High") {
          input.checked = true;
        }
      } else {
        input.setAttribute("type", "text");
        input.setAttribute("value", spanList[i].textContent);
        input.setAttribute("placeholder", `${spanList[i].className}...`);
      }
      spanList[i].after(input);
      input.classList.add(`${spanList[i].className}`);
      input.setAttribute("id", `${spanList[i].className}Input`);
      input.dataset.todo = "removable";
      spanList[i].style.display = "none";
    }

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("save-todo");
    saveBtn.dataset.todo = "removable";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-todo");
    cancelBtn.dataset.todo = "removable";
    cancelBtn.textContent = "Cancel";

    el.parentNode.querySelectorAll("input")[3].after(saveBtn, cancelBtn);

    el.parentNode.querySelector(".edit-todo").style.display = "none";
    el.parentNode.querySelector(".remove-todo").style.display = "none";

    const titleInput = document.querySelector("#titleInput");
    const projectInput = document.querySelector("#projectInput");
    const dateInput = document.querySelector("#dateInput");
    titleInput.focus();

    const validateForm = () => {
      if (titleInput.value === null || titleInput.value === "") {
        alert("Title is required");
        titleInput.focus();
        return false;
      }

      if (titleInput.value.length > 20) {
        alert("Title needs to be under 20 characters.");
        titleInput.focus();
        return false;
      }

      if (projectInput.value === null || projectInput.value === "") {
        alert("Project is required");
        projectInput.focus();
        return false;
      }

      if (projectInput.value.length > 20) {
        alert("Project needs to be under 20 characters.");
        projectInput.focus();
        return false;
      }

      if (dateInput.value === null || dateInput.value === "") {
        alert("Date is required");
        dateInput.focus();
        return false;
      }

      return true;
    };

    const checkProjectNames = (name) => {
      const project = projects.children;

      for (let i = 0; i < project.length; i++) {
        for (let s = 0; s < project[i].children.length; s++) {
          if (project[i].children[s].classList.contains("project-text")) {
            if (project[i].children[s].textContent === name) {
              return false;
            }
          }
        }
      }

      return true;
    };

    const createProject = () => {
      const name = projectInput.value;

      if (checkProjectNames(name) === true) {
        const projectEl = document.createElement("li");
        projectEl.classList.add("project");
        projects.append(projectEl);

        const img = document.createElement("img");
        img.classList.add("project-img");
        img.src = "./images/align-justify.svg";
        projectEl.append(img);

        const p = document.createElement("p");
        p.classList.add("project-text");
        p.textContent = name;
        projectEl.append(p);

        const remove = document.createElement("div");
        remove.classList.add("project-delete");
        remove.textContent = "x";
        projectEl.append(remove);
      }
    };

    const removeInputFields = () => {
      const inputFields = el.parentNode.getElementsByTagName("input");

      for (let i = inputFields.length - 1; i >= 0; --i) {
        inputFields[i].remove();
      }

      for (let i = 0; i < spanList.length; i += 1) {
        if (el.parentNode.contains(spanList[i])) {
          if (spanList[i].className !== "description") {
            spanList[i].style.display = "block";
          }
        }
      }

      saveBtn.remove();
      cancelBtn.remove();
      el.parentNode.querySelector(".edit-todo").style.display = "block";
      el.parentNode.querySelector(".remove-todo").style.display = "block";
    };

    const saveBtnHandler = () => {
      const inputFields = el.parentNode.getElementsByTagName("input");
      const currentId = el.parentNode.dataset.id;

      if (validateForm() === true) {
        for (let i = 0; i < spanList.length; i += 1) {
          if (inputFields[i].className === "date") {
            spanList[i].textContent = format(
              new Date(inputFields[i].value),
              "dd/MM/yyyy"
            );
            todo.update(
              Number(currentId),
              spanList[i].className,
              inputFields[i].value
            );
          } else if (inputFields[i].className === "priority") {
            if (inputFields[i].checked === true) {
              spanList[i].textContent = "High";
              console.log("high");
            } else {
              spanList[i].textContent = "None";
            }
            todo.update(
              Number(currentId),
              spanList[i].className,
              spanList[i].textContent
            );
          } else {
            spanList[i].textContent = inputFields[i].value;
            todo.update(
              Number(currentId),
              spanList[i].className,
              inputFields[i].value
            );
          }
        }
        createProject();
        removeInputFields();
        localStorage.setItem("array", JSON.stringify(todo.array));

        if (mainTitle.textContent === "Today") {
          clearContent();
          today.renderToday();
        } else if (mainTitle.textContent === "Upcoming") {
          clearContent();
          upcoming.renderUpcoming();
        } else if (
          mainTitle.textContent !== "Overview" &&
          mainTitle.textContent !== "Today" &&
          mainTitle.textContent !== "Upcoming"
        ) {
          clearContent();
          projectLogic.renderProjects(mainTitle.textContent);
        }
      }
    };

    saveBtn.addEventListener("click", saveBtnHandler);
    cancelBtn.addEventListener("click", removeInputFields);
  };

  const removeTodoHandler = (el) => {
    const currentId = Number(el.parentNode.dataset.id);
    todo.array.forEach((obj) => {
      if (obj.id === currentId) {
        const index = todo.array.indexOf(obj);
        todo.array.splice(index, 1);
      }
    });
    el.parentNode.remove();
    localStorage.setItem("array", JSON.stringify(todo.array));
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("edit-todo")) {
      editTodoHandler(e.target);
    }
    if (e.target.classList.contains("remove-todo")) {
      removeTodoHandler(e.target);
    }
  };

  const activeModule = (module) => {
    const { children } = document.querySelector("#sidebar-container");
    const project = document.querySelector("#dynamic-projects").children;

    for (let i = 0; i < children.length; i += 1) {
      if (children[i] === module) {
        children[i].classList.add("active-module");
        for (let i = 0; i < project.length; i += 1) {
          for (let s = 0; s < project[i].children.length; s += 1) {
            if (project[i].children[s].classList.contains("project-text")) {
              project[i].children[s].classList.remove("active-module");
            }
          }
        }
      }
      if (children[i] !== module) {
        children[i].classList.remove("active-module");
      }
    }
  };

  const outsideClick = (e) => {
    const overview = document.querySelector("#overview");
    const today = document.querySelector("#today");
    const upcoming = document.querySelector("#upcoming");

    switch (e.target) {
      case overview:
        activeModule(overview);
        break;
      case overview.firstChild:
        activeModule(overview);
        break;
      case today:
        activeModule(today);
        break;
      case today.firstChild:
        activeModule(today);
        break;
      case upcoming:
        activeModule(upcoming);
        break;
      case upcoming.firstChild:
        activeModule(upcoming);
        break;
    }

    const sidebarContainer = document.querySelector("#sidebar-container");
    const todoForm = document.querySelector("#todo-form");
    const section = document.querySelector("section");

    const removableElements = container.querySelectorAll(
      '[data-todo="removable"]'
    );
    const hideableElements = container.querySelectorAll(
      '[data-todo="hideable"]'
    );

    if (
      e.target.parentNode === sidebarContainer ||
      e.target.parentNode.parentNode === sidebarContainer ||
      e.target.parentNode.parentNode.parentNode === sidebarContainer ||
      e.target.parentNode.parentNode.parentNode.parentNode ===
        sidebarContainer ||
      e.target === todoForm ||
      e.target.parentNode === todoForm ||
      e.target.parentNode.parentNode === todoForm ||
      e.target.parentNode === section
    ) {
      for (let i = 0; i < hideableElements.length; i++) {
        if (hideableElements[i].className !== "description") {
          hideableElements[i].style.display = "block";
        }
      }

      for (let i = removableElements.length - 1; i >= 0; --i) {
        removableElements[i].remove();
      }
    }

    if (
      e.target.classList.contains("list") ||
      e.target.parentNode.classList.contains("list")
    ) {
    } else {
      for (let i = 0; i < hideableElements.length; i += 1) {
        if (hideableElements[i].className === "description") {
          hideableElements[i].style.display = "none";
        }
      }
    }
  };

  container.addEventListener("click", handleClick);
  document.addEventListener("click", outsideClick);
})();

export { todoDOM };
