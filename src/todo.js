const todo = (() => {
  const array = [];
  let counter;

  if (localStorage.length === 0 || localStorage.array.length === 2) {
    counter = 0;
  } else {
    const localUsers = JSON.parse(localStorage.getItem("array"));
    counter = Number(localUsers[localUsers.length - 1].id + 1);
  }

  const create = (title, project, priority, date) => {
    array.push({
      title,
      project,
      priority,
      date,
      id: counter++,
    });
  };

  const remove = (id) => {
    array.forEach((obj) => {
      const index = array.indexOf(obj);
      if (obj.id === id) {
        array.splice(index, 1);
      }
    });
  };

  const update = (id, prop, value) => {
    array.forEach((obj) => {
      if (obj.id === id) {
        obj[prop] = value;
      }
    });
  };

  return {
    array,
    create,
    remove,
    update,
  };
})();

export { todo };
