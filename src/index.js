import "./index.css";
import { storage } from "./localStorage.js";
import { todo } from "./todo.js";
import { overview } from "./overview.js";
import { projectLogic } from "./project.js";
import { addTodoForm } from "./addTodoForm.js";
import { addProjectForm } from "./addProjectForm.js";
import { todoDOM } from "./todoDOM.js";
import { today } from "./today.js";
import { upcoming } from "./upcoming.js";

const { validate } = require("schema-utils");

overview.renderOverview();
