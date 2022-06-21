
import React from 'react'; 
import {useQuery, gql, useMutation} from '@apollo/client';


const GET_TODOS = gql`
query MyQuery {
  todos {
    done
    id
    text
  }
}
`;

const TOGGLE_TODO = gql`
mutation toggleTodo($id: uuid!, $done:Boolean!) {
  update_todos(where: {id: { _eq: $id }}, _set: { done: $done }) {
    returning {
      done
      id
      text
    }
  }
}
`;


const ADD_TODO = gql`
mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`;

const DELETE_TODO = gql`
mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`;



function App() {
  const [text, setText] = React.useState(); 
  const {data, loading, error} = useQuery(GET_TODOS); 
  const[toggleTodo] =  useMutation(TOGGLE_TODO);
  const[addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);


  async function handleToggleTodo({id, done}){
    await toggleTodo({variables: {id, done: !done}})
      
  }

  async function handleAddTodo(event){
    event.preventDefault();
    if(!text.trim()) return;
      await addTodo({variables: {text: text},
      refetchQueries: [
        {query: GET_TODOS}
      ]})
   
    setText("");

  }

  async function handleDeleteTodo({ id }){
    await deleteTodo ({ 
      variables: {id},
      update: cache => {
        const prevData = cache.readQuery({ query: GET_TODOS})
        const newTodos = prevData.todos.filter(todo => todo.id !== id); 
        cache.writeQuery({ query: GET_TODOS, data: {todos: newTodos}})
      }
    
    });

  }
  if(loading) return <div>loading todos....</div>
  if(error) return <div>Error fetching todos</div>

   
  return (
    <div className="vh-100 code flex flex-column items-center pa4 fl-1">
      <h1 className="f2-l"> TODO'S Application {" "}
      <span role="img" aria-label="checkmark"></span>
      </h1>
      <form className="mb3" onSubmit={handleAddTodo}>
        <input
          className="pa2 f4 b-dashed"
          type="text"
          placeholder='New Todo'
          onChange={event => setText(event.target.value)}
          value={text}
        />
        <button className="pa2 f4" type='submit'>Create</button>
      </form>
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p onDoubleClick={()=>handleToggleTodo(todo)} key={todo.id}>
            <span className={`${todo.done && 'strike'}`}>
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo) }>&times;</button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
