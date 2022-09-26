import { isToday, parseISO, format } from "date-fns";
import { todo } from "./todo.js";

const today = (() => {
  const sidebarTitle = document.querySelector("#today");
  const mainTitle = document.querySelector("#main-title");
  const container = document.querySelector("#todo-container");
  const projectWrapper = document.querySelector(".project-wrapper");

  const changeTitle = () => {
    mainTitle.textContent = "Today";
  };

  const clearContent = () => {
    while (container.childNodes.length > 4) {
      container.removeChild(container.lastChild);
    }
  };

  const renderToday = () => {
    todo.array.forEach((obj) => {
      if (isToday(parseISO(obj.date)) === true) {
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
    if (mainTitle.textContent !== "Today") {
      changeTitle();
      clearContent();
      renderToday();
    }

    projectWrapper.style.display = "block";
    const projectName = document.querySelector(".project-name");
    if (typeof projectName !== "undefined" && projectName !== null) {
      projectName.style.display = "none";
    }
  };

  sidebarTitle.addEventListener("click", handleClick);

  return { renderToday };
})();

export { today };
