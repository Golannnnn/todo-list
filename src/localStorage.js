import { todo } from "./todo.js";

const storage = (() => {
  const projects = document.querySelector("#dynamic-projects");

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

  if (localStorage.length !== 0 && localStorage.array.length !== 2) {
    const localUsers = JSON.parse(localStorage.getItem("array"));

    for (let i = 0; i < localUsers.length; i += 1) {
      const obj = localUsers[i];

      todo.array.push(obj);
    }

    todo.array.forEach((obj) => {
      const name = obj.project;

      if (checkProjectNames(name) === true) {
        const project = document.createElement("li");
        project.classList.add("project");
        // project.textContent = name;
        projects.append(project);

        const img = document.createElement("img");
        img.classList.add("project-img");
        img.src = "./images/align-justify.svg";
        project.append(img);

        const p = document.createElement("p");
        p.classList.add("project-text");
        p.textContent = name;
        project.append(p);

        const remove = document.createElement("div");
        remove.classList.add("project-delete");
        remove.textContent = "x";
        project.append(remove);
      }
    });
  }
})();

export { storage };
