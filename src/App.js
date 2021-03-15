import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Todo from './components/todo/Todo';
import TodoForm from './components/todo/TodoForm';
import ListTodo from './components/todo/ListTodo';

const App = () =>{
  return(
    <Router>
      <Switch>
        <Route exact path='/' component={Todo} />
        <Route exact path='/form/:name' component={TodoForm} />
        <Route exact path='/form/:name/:id' component={TodoForm} />
        <Route exact path='/list/:name' component={ListTodo} />
        <Route exact path='*' component={()=> <div className='fof'><h2><b>404</b>  | Page not found..</h2></div>} />
      </Switch>
    </Router>
  )
} 

export default App;
