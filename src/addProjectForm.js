const addProjectForm = (() => {
  const open = document.querySelector("#open-project-form");
  const form = document.querySelector("#project-form");
  const input = document.querySelector("#project-name");
  const add = document.querySelector("#add-project-name");
  const cancel = document.querySelector("#cancel-project-form");
  const projects = document.querySelector("#dynamic-projects");

  const openForm = () => {
    open.style.display = "none";
    form.style.display = "flex";
    input.focus();
  };

  const closeForm = () => {
    open.style.display = "flex";
    form.style.display = "none";
    form.reset();
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

  const checkIfExists = (x) => {
    const project = projects.children;

    for (let i = 0; i < project.length; i += 1) {
      for (let s = 0; s < project[i].children.length; s += 1) {
        if (project[i].children[s].classList.contains("project-text")) {
          if (project[i].children[s].textContent === x) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const validateForm = () => {
    if (input.value === null || input.value === "") {
      errorMsg(input, "Project is required");
      return false;
    }
    succesMsg(input);

    if (input.value.length > 20) {
      errorMsg(input, "Project is too long");
      return false;
    }
    succesMsg(input);

    if (checkIfExists(input.value) === false) {
      errorMsg(input, "Project already exists");
      return false;
    }
    succesMsg(input);

    return true;
  };

  const createProject = (e) => {
    e.preventDefault();

    if (validateForm() === true) {
      const name = input.value;
      const project = document.createElement("li");
      project.classList.add("project");
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
      closeForm();
    }
  };

  const outsideClick = (e) => {
    const outsideForm = form.contains(e.target);
    const outsideOpenForm = open.contains(e.target);
    if (!outsideForm && !outsideOpenForm) {
      closeForm();
    }
  };

  input.onkeyup = validateForm;
  input.onchange = validateForm;

  open.addEventListener("click", openForm);
  add.addEventListener("click", createProject);
  cancel.addEventListener("click", closeForm);
  document.addEventListener("click", outsideClick);
})();

export { addProjectForm };
