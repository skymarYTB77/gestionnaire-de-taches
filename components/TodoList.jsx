import { useEffect } from "react";

function sortWithName(a, b) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function sortWithDate(a, b) {
  if (a.dateStart == '') {
    return 1;
  } else if (b.dateStart == '') {
    return -1;
  }

  let dateStartA = new Date(a.dateStart).getTime();
  let dateStartB = new Date(b.dateStart).getTime();
  return dateStartA - dateStartB;
}

function sortWithPriority(a, b) {
  let priorityToNum = {
    'high': 1,
    'mid': 2,
    'low': 3,
  };

  if (a.priority == b.priority) {
    return sortWithDate(a, b);
  }
  return priorityToNum[a.priority] - priorityToNum[b.priority];
}

function TodoList(props) {
  const todoList = props.todoLists.filter(todoList => todoList.id === props.activeListId)[0] || props.todoLists[0];

  let uncheckedTodo = todoList.data.filter(todo => !todo.checked);
  let checkedTodo = todoList.data.filter(todo => todo.checked);

  if (todoList.sort == 'date') {
    uncheckedTodo.sort(sortWithDate);
  } else if (todoList.sort == 'priority') {
    uncheckedTodo.sort(sortWithPriority);
  } else if (todoList.sort == 'name') {
    uncheckedTodo.sort(sortWithName);
  }

  if (todoList.filter != null) {
    uncheckedTodo = uncheckedTodo.filter(todo => {
      if (!todo.dateStart) return false;
      
      const todoDate = new Date(todo.dateStart);
      todoDate.setHours(12, 0, 0, 0);
      
      const filterDate = new Date(todoList.filter);
      filterDate.setHours(12, 0, 0, 0);

      return todoDate.getTime() === filterDate.getTime();
    });

    checkedTodo = checkedTodo.filter(todo => {
      if (!todo.dateStart) return false;
      
      const todoDate = new Date(todo.dateStart);
      todoDate.setHours(12, 0, 0, 0);
      
      const filterDate = new Date(todoList.filter);
      filterDate.setHours(12, 0, 0, 0);

      return todoDate.getTime() === filterDate.getTime();
    });
  }

  return (
    <>
      { uncheckedTodo.map(props.mapTodo) }
      { checkedTodo.map(props.mapTodo) }
    </>
  )
}

export default TodoList;