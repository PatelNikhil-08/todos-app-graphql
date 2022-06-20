
import React from 'react'; 
import {useQuery, gql} from '@apollo/client';


const GET_TODOS = gql`
query MyQuery {
  todos {
    done
    id
    text
  }
}

`
function App() {
  const {data, loading, error} = useQuery(GET_TODOS); 
  if(loading) return <div>loading todos....</div>
  if(error) return <div>Error fetching todos</div>

   
  return (
    <div>
      <h1>Basic TODO'S Application using GRAPHQL </h1>
      {data.todos.map(todo => (
        <p key={todo.id}>
          <span>
            {todo.text}
          </span>
          <button>&times;</button>
        </p>
      ))}
    </div>
  );
}

export default App;
