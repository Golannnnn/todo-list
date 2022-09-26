import { format } from "date-fns";
import { todo } from "./todo.js";
import { overview } from "./overview.js";

const projectLogic = (() => {
  const mainTitle = document.querySelector("#main-title");
  const container = document.querySelector("#todo-container");
  const projects = document.querySelector("#dynamic-projects");
  const projectWrapper = document.querySelector(".project-wrapper");

  const activeModule = (module) => {
    const project = document.querySelector("#dynamic-projects").children;
    const { children } = document.querySelector("#sidebar-container");

    for (let i = 0; i < project.length; i += 1) {
      for (let s = 0; s < project[i].children.length; s += 1) {
        if (project[i].children[s].classList.contains("project-text")) {
          if (project[i].children[s].textContent === module) {
            project[i].children[s].classList.add("active-module");
            for (let i = 0; i < children.length; i += 1) {
              children[i].classList.remove("active-module");
            }
          }
          if (project[i].children[s].textContent !== module) {
            project[i].children[s].classList.remove("active-module");
          }
        }
      }
    }
  };

  const changeTitle = (projectName) => {
    mainTitle.textContent = projectName;
  };

  const changeInput = (name) => {
    if (document.querySelectorAll(".project-name").length === 0) {
      const p = document.createElement("p");
      p.classList.add("project-name");
      projectWrapper.after(p);
      projectWrapper.style.display = "none";
      p.style.display = "block";
      p.textContent = name;
    } else {
      const projectName = document.querySelector(".project-name");
      projectWrapper.style.display = "none";
      projectName.style.display = "block";
      projectName.textContent = name;
    }
  };

  const clearContent = () => {
    while (container.childNodes.length > 4) {
      container.removeChild(container.lastChild);
    }
  };

  const renderProjects = (projectName) => {
    todo.array.forEach((obj) => {
      if (obj.project === projectName) {
        const list = document.createElement("li");
        list.classList.add("list");
        list.dataset.id = obj.id;
        container.append(list);

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.classList.add("edit-todo");
        edit.dataset.todo = "hideable";

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.classList.add("remove-todo");
        remove.dataset.todo = "hideable";

        list.append(edit, remove);

        for (const prop in obj) {
          if (prop !== "id") {
            const span = document.createElement("span");
            span.classList.add(`${prop}`);
            span.dataset.todo = "hideable";
            if (prop === "date") {
              span.textContent = format(new Date(obj[prop]), "dd/MM/yyyy");
            } else {
              span.textContent = obj[prop];
            }
            if (span.classList.contains("description")) {
              remove.after(span);
            } else {
              edit.before(span);
            }
          }
        }
      }
    });
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("project")) {
      const name = e.target.querySelector("p").textContent;
      changeTitle(name);
      clearContent();
      renderProjects(name);
      activeModule(name);
      changeInput(name);
    }

    if (e.target.classList.contains("project-img")) {
      const name = e.target.parentNode.querySelector("p").textContent;
      changeTitle(name);
      clearContent();
      renderProjects(name);
      activeModule(name);
      changeInput(name);
    }

    if (e.target.classList.contains("project-text")) {
      const name = e.target.parentNode.querySelector("p").textContent;
      changeTitle(name);
      clearContent();
      renderProjects(name);
      activeModule(name);
      changeInput(name);
    }

    if (e.target.classList.contains("project-delete")) {
      const parent = e.target.parentNode;
      parent.remove();

      let i = todo.array.length;
      while (i--) {
        if (todo.array[i].project === parent.querySelector("p").textContent) {
          todo.array.splice(i, 1);
        }
      }
      localStorage.setItem("array", JSON.stringify(todo.array));
      changeTitle("Overview");
      clearContent();
      overview.renderOverview();
      document.querySelector("#overview").classList.add("active-module");

      document.querySelectorAll(".project-name").forEach((e) => e.remove());

      projectWrapper.style.display = "block";
    }
  };

  projects.addEventListener("click", handleClick);

  return { renderProjects };
})();

export { projectLogic };
