import { endOfToday, isAfter, parseISO, format } from "date-fns";
import { todo } from "./todo.js";

const upcoming = (() => {
  const sidebarTitle = document.querySelector("#upcoming");
  const mainTitle = document.querySelector("#main-title");
  const container = document.querySelector("#todo-container");
  const projectWrapper = document.querySelector(".project-wrapper");

  const changeTitle = () => {
    mainTitle.textContent = "Upcoming";
  };

  const clearContent = () => {
    while (container.childNodes.length > 4) {
      container.removeChild(container.lastChild);
    }
  };

  const renderUpcoming = () => {
    todo.array.forEach((obj) => {
      if (isAfter(parseISO(obj.date), endOfToday()) === true) {
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

  const handleClick = () => {
    if (mainTitle.textContent !== "Upcoming") {
      changeTitle();
      clearContent();
      renderUpcoming();
    }

    projectWrapper.style.display = "block";
    const projectName = document.querySelector(".project-name");
    if (typeof projectName !== "undefined" && projectName !== null) {
      projectName.style.display = "none";
    }
  };

  sidebarTitle.addEventListener("click", handleClick);

  return { renderUpcoming };
})();

export { upcoming };
