import { format } from "date-fns";
import { todo } from "./todo.js";
import { overview } from "./overview.js";
import { today } from "./today.js";
import { upcoming } from "./upcoming.js";
import { projectLogic } from "./project.js";

const addTodoForm = (() => {
  const mainTitle = document.querySelector("#main-title");
  const form = document.querySelector("#todo-form");
  const add = document.querySelector("#add-todo-form");
  const title = document.querySelector("#title");
  const project = document.querySelector("#project");
  const priority = document.querySelector("#priority");
  const date = document.querySelector("#due-date");
  const container = document.querySelector("#todo-container");
  const input = document.querySelectorAll("input");
  const projects = document.querySelector("#dynamic-projects");

  const clearContent = () => {
    while (container.childNodes.length > 4) {
      container.removeChild(container.lastChild);
    }
  };

  const addLastTodo = () => {
    if (mainTitle.textContent === "Overview") {
      overview.renderOverview();
    } else if (mainTitle.textContent === "Today") {
      today.renderToday();
    } else if (mainTitle.textContent === "Upcoming") {
      upcoming.renderUpcoming();
    } else {
      const name = mainTitle.textContent;
      projectLogic.renderProjects(name);
    }
  };

  const clearMsg = (element) => {
    const inputWrapper = element.parentElement;
    const errorText = inputWrapper.querySelector(".error");

    errorText.innerText = "";
    inputWrapper.classList.remove("success");
    inputWrapper.classList.remove("error");
  };

  const errorMsg = (element, message) => {
    const inputWrapper = element.parentElement;
    const errorText = inputWrapper.querySelector(".error");

    errorText.innerText = message;
    inputWrapper.classList.add("error");
    inputWrapper.classList.remove("success");
  };

  const succesMsg = (element) => {
    const inputWrapper = element.parentElement;
    const errorText = inputWrapper.querySelector(".error");

    errorText.innerText = "";
    inputWrapper.classList.add("success");
    inputWrapper.classList.remove("error");
  };

  const validateForm = () => {
    if (title.value === null || title.value === "") {
      errorMsg(title, "Title is required");
      return false;
    }
    succesMsg(title);

    if (title.value.length > 20) {
      errorMsg(title, "Title is too long");
      return false;
    }
    succesMsg(title);

    if (
      mainTitle.textContent === "Overview" ||
      mainTitle.textContent === "Today" ||
      mainTitle.textContent === "Upcoming"
    ) {
      if (project.value === null || project.value === "") {
        errorMsg(project, "Project is required");
        return false;
      }
      succesMsg(project);

      if (project.value.length > 20) {
        errorMsg(project, "Project is too long");
        return false;
      }
      succesMsg(project);
    }

    if (date.value === null || date.value === "") {
      errorMsg(date, "Date is required");
      return false;
    }
    succesMsg(date);

    return true;
  };

  for (let i = 0; i < input.length; i += 1) {
    input[i].onkeyup = validateForm;
    input[i].onchange = validateForm;
  }

  const checkProjectNames = (name) => {
    const project = projects.children;

    for (let i = 0; i < project.length; i += 1) {
      for (let s = 0; s < project[i].children.length; s += 1) {
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
    const name = project.value;

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

  const addTodo = (e) => {
    e.preventDefault();

    const titleValue = title.value;
    const projectValue = project.value;
    const dateValue = date.value;

    const priorityValue = () => {
      if (priority.checked === true) {
        return "High";
      }
      return "None";
    };

    if (validateForm() === true) {
      if (
        mainTitle.textContent !== "Overview" &&
        mainTitle.textContent !== "Today" &&
        mainTitle.textContent !== "Upcoming"
      ) {
        todo.create(
          titleValue,
          mainTitle.textContent,
          priorityValue(),
          dateValue
        );
        localStorage.setItem("array", JSON.stringify(todo.array));
      } else {
        todo.create(titleValue, projectValue, priorityValue(), dateValue);
        localStorage.setItem("array", JSON.stringify(todo.array));
        createProject();
      }
      clearContent();
      addLastTodo();
      form.reset();
      clearMsg(title);
      clearMsg(project);
      clearMsg(date);
    }
  };

  const outsideClick = (e) => {
    const main = document.querySelector("main");
    const outsideMain = main.contains(e.target);

    if (!outsideMain) {
      form.reset();
      clearMsg(title);
      clearMsg(project);
      clearMsg(date);
    }
  };

  add.addEventListener("click", addTodo);
  document.addEventListener("click", outsideClick);
})();

export { addTodoForm };
