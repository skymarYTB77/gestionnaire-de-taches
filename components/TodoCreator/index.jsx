import { useRef, useState, useEffect } from 'react';
import Priority from './Priority'
import Title from './Title';
import DateInput from './Date';
import Tags from './Tags';
import Buttons from './Buttons';

const initTodo = {
  name: '',
  priority: 'low',
  dateStart: '',
  tags: [],
  checked: false
};

function TodoCreator(props) {
  const [todo, setTodo] = useState(props.displayedTodo);
  const nameRef = useRef(null);
  const dateStartRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    setTodo(props.displayedTodo);
  }, [props.displayedTodo]);

  function handleSubmit() {
    if (todo.name === '') return;

    nameRef.current.focus();
    nameRef.current.value = '';
    dateStartRef.current.value = '';
    tagsRef.current.value = '';

    if (props.creatorState === 'add') {
      const newTodoLists = props.todoLists.map(todoList => {
        if (todoList.id === props.activeListId) {
          return {...todoList, data: [todo, ...todoList.data]};
        }
        return todoList;
      });
      props.setTodoLists(newTodoLists);

      // Garder la date si le filtre est actif
      const activeList = props.todoLists.find(list => list.id === props.activeListId);
      if (activeList?.filter) {
        setTodo({...initTodo, dateStart: todo.dateStart});
        props.setDisplayedTodo({...initTodo, dateStart: todo.dateStart});
      } else {
        setTodo(initTodo);
        props.setDisplayedTodo(initTodo);
      }
    } else if (props.creatorState === 'edit') {
      const newTodoLists = props.todoLists.map(todoList => {
        if (todoList.id === props.activeListId) {
          const newTodoListData = todoList.data.map(t=> {
            if (t === props.displayedTodo) {
              return todo;
            }
            return t;
          });
          return {...todoList, data: newTodoListData};
        }
        return todoList;
      });
      props.setTodoLists(newTodoLists);
      props.setCreatorState('hidden');
      props.setDisplayedTodo(initTodo);
    }
  }

  return (
    <>
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-black z-10 opacity-50"
        onClick={() => {
          props.setCreatorState('hidden');
          props.setDisplayedTodo(initTodo);
        }}
      />
      <div
        className="w-[600px] h-max px-8 py-6 text-white bg-neutral-800
        rounded-lg fixed left-1/2 -translate-x-1/2 z-20 flex flex-col gap-6 outline-none top-1/2 -translate-y-1/2"
      >
        <Title 
          todo={todo}
          setTodo={setTodo}
          nameRef={nameRef}
          handleSubmit={handleSubmit}
        />
        <div className="flex gap-8">
          <DateInput
            todo={todo}
            setTodo={setTodo}
            dateStartRef={dateStartRef}
          />
          <div className="flex flex-col flex-1 gap-6">
            <Priority
              todo={todo}
              setTodo={setTodo}
              todoLists={props.todoLists}
              setTodoLists={props.setTodoLists}
            />
            <Tags
              todo={todo}
              setTodo={setTodo}
              tagsRef={tagsRef}
              handleSubmit={handleSubmit}
            />
            <Buttons
              creatorState={props.creatorState}
              setCreatorState={props.setCreatorState}
              setDisplayedTodo={props.setDisplayedTodo}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoCreator;