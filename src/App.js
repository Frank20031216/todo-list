import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
import { useState, useRef, useEffect } from "react";

function App(props) {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editCount,setEditCount]= useState(0);
  
  const listHeadingRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then((response) => {     
      return response.json();
    }).then((todos) => {
      setTasks(todos);
      //console.log(todos);
    })
}, [editCount])
  
  function addtask(name) {
    fetch("http://localhost:8080/todo/add?name="+name+"&isCompleted=false",{method: 'POST'}).then(() => {
      setEditCount(editCount+1);    
    })
  }

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.iscompleted,
    Completed: (task) => task.iscompleted,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      console.log("focus on list heading");
    }
  });



  function deleteTask(id) {
    //const remainingTasks = tasks.filter((task) => id !== task.id);
    //setTasks(remainingTasks);
    //const deletedTask = tasks.filter((task) => id == task.id);
    fetch("http://localhost:8080/todo/delete?id="+id, 
      {method: 'post'}).then(() => {
      setEditCount(editCount+1);    
    })
  }

  function toggleTaskCompleted(id) {
    /*const updatedTasks = tasks.map((task) => {
      
      if (id === task.id) {      
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);*/
    fetch("http://localhost:8080/todo/changecompleted?id="+id,
       {method: 'post'}).then(() => {
      setEditCount(editCount+1);    
    })
  }

  function editTask(id, newName) {
    
    fetch("http://localhost:8080/todo/update?id="+id+"&name="+newName, 
      {method: 'post'}).then(() => {
        setEditCount(editCount+1);    
      })   

  }
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.iscompleted}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;


  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>

      <Form addtask={addtask} />

      <div className="filters btn-group stack-exception">
        {filterList}

      </div>

      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}

      </ul>
    </div>

  );
}

export default App;
