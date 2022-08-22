const getTasks = () => JSON.parse(localStorage.getItem('data'));

const clearCompleted = () => {
  const arr = getTasks();
  const dom = document.querySelectorAll('.taks-wrapper');
  const arr2 = arr.filter((element, index) => {
    if (element.complete) { dom[index].remove(); }
    return !element.complete;
  });

  arr2.sort((b, a) => b.index - a.index);
  localStorage.setItem('data', JSON.stringify(arr2));
};

const updateCheckBox = () => {
  const arr = getTasks();
  document.querySelectorAll('.done').forEach((el, index) => {
    if (arr[index].complete) {
      el.style.display = 'block';
      el.previousElementSibling.style.display = 'none';
    } else {
      el.style.display = 'none';
      el.previousElementSibling.style.display = 'block';
    }
  });
};

const editPreserve = (div) => {
  div.querySelector('input').onchange = (e) => {
    let current = e.target.parentNode;
    const newVal = e.target.value;
    let i = 0;
    while (current !== null) {
      i += 1;
      current = current.previousElementSibling;
    }

    const arr = getTasks();
    const index = arr.findIndex((object) => object.index === i);
    arr[index].discription = newVal;
    localStorage.setItem('data', JSON.stringify(arr));
  };
};

const removeTaskFromLocalStorage = (d) => {
  const arr = getTasks();
  const index = arr.findIndex((object) => object.discription === d);
  arr.splice(index, 1);
  arr.forEach((item, index) => {
    item.index = index + 1;
  });
  localStorage.setItem('data', JSON.stringify(arr));
};

const removeFuncionality = (div) => {
  div.querySelector('.trash').onclick = (e) => {
    e.target.parentNode.remove();
    const task = e.target.parentNode.querySelector('input').value;

    removeTaskFromLocalStorage(task);
  };
};

const whatIsIndex = (current) => {
  let i = 0;
  while (current !== null) {
    i += 1;
    current = current.previousElementSibling;
  }
  return i - 1;
};

const checked = (div) => {
  const index = whatIsIndex(div);

  const arr = getTasks();
  arr[index].complete = true;

  localStorage.setItem('data', JSON.stringify(arr));
};

const unchecked = (div) => {
  const index = whatIsIndex(div);

  const arr = getTasks();
  arr[index].complete = false;

  localStorage.setItem('data', JSON.stringify(arr));
};

const addInterAction = (div) => {
  div.firstChild.nextElementSibling.nextElementSibling.onclick = (e) => {
    e.target.style.display = 'none';
    e.target.previousElementSibling.style.display = 'block';
    unchecked(e.target.parentNode);
  };
  div.firstChild.nextElementSibling.onclick = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';

    checked(e.target.parentNode);
  };
};

const generateTask = (task) => {
  const html = `
      <img id="unchecked" class="unchecked" src="./assets/images/unchecked-checkbox.png" alt="">
      <img id="done" class="done" src="./assets/images/done.png" alt="">
      <input type="text" value="${task}">
      <img class="three-dots" src="./assets/images/three-dots-vertical.svg" alt="">
      <img class="trash" src="./assets/images/trash.svg" alt="">
      `;
  const div = document.createElement('div');
  div.classList.add('taks-wrapper');
  div.innerHTML = html;
  return div;
};

const addNewTask = (task) => {
  const data = getTasks();
  const obj = {
    discription: task,
    complete: false,
    index: data.length + 1,
  };
  data.push(obj);
  localStorage.setItem('data', JSON.stringify(data));
  const div = generateTask(task);
  addInterAction(div);
  removeFuncionality(div);
  editPreserve(div);

  document.querySelector('.task-list').appendChild(div);
};

const checkInteraction = () => {
  document.querySelectorAll('.done').forEach((el) => {
    el.onclick = (e) => {
      e.target.style.display = 'none';
      e.target.previousElementSibling.style.display = 'block';
      unchecked(e.target.parentNode);
    };
  });

  document.querySelectorAll('.unchecked').forEach((el) => {
    el.onclick = (e) => {
      e.target.style.display = 'none';
      e.target.nextElementSibling.style.display = 'block';
      checked(e.target.parentNode);
    };
  });
};

const isLocalStorageEmpty = () => localStorage.getItem('data') == null;

window.onload = () => {
  if (isLocalStorageEmpty()) {
    localStorage.setItem('data', '[]');
  } else {
    const tasks = getTasks();

    // tasks.sort((b, a) => b.index - a.index);
    tasks.forEach((el) => {
      const div = generateTask(el.discription);
      removeFuncionality(div);
      editPreserve(div);
      document.querySelector('.task-list').appendChild(div);
    });

    checkInteraction();
    updateCheckBox();
  }
};

document.getElementById('add-new-task').onchange = (e) => {
  const newTask = e.target.value;
  addNewTask(newTask);
  e.target.value = '';
};

document.querySelector('.end button').onclick = clearCompleted;