import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import loadingGif from './loading.gif';

import './App.css';

import ListItem from './ListItem';

class App extends Component {

  constructor(){
    super();

    
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      loading: true,


      todos: []
    };


    this.apiUrl = 'https://5c37c4f87820ff0014d927d2.mockapi.io';

    this.handleChange = this.handleChange.bind(this);
    this.addTodo =  this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.generateTodoId =  this.generateTodoId.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount(){
    const response =  await axios.get(`${this.apiUrl}/todos`);

    this.setState({
      todos: response.data,
      loading: false,
    })
  }


  handleChange(event){

    this.setState({
      newTodo: event.target.value
    })
  }

  generateTodoId() {
    const lastTodo =  this.state.todos[this.state.todos.length -1];

    if(lastTodo){
      return lastTodo.id + 1;
    }

    return 1;
  }

  async addTodo(){

    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    });

    const todos =  this.state.todos;
    todos.push(response.data);

    this.setState({
      todos:todos,
      newTodo: ''
    })

    this.alert('Todo created successfully')
  }

  async deleteTodo(index) {
    const todos = this.state.todos;

    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    

    delete todos[index];

    this.setState({
      todos
    })

    this.alert('Todo deleted successfully')
  }

 editTodo(index) {

    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index,
    })

    this.alert('Todo updated successfully')
  }

  async updateTodo() {
    const todo =  this.state.todos[this.state.editingIndex];
    
    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;

    this.setState({ todos, editing: false, editingIndex: null, newTodo: ''});
  }

  alert(notification) {
    this.setState({
      notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 2000)
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
         
            React Crud

            <h1 className="app-title">CRUD REACT</h1>
        </header>
        
        <div className="container">

         {
            this.state.notification && 
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }

          <input 
          type="text" 
          name="todo"
          className="my-4 form-control"
          placeholder="Add a new to do"
          onChange={this.handleChange}
          value={this.state.newTodo}
          />

          <button 
            onClick={this.state.editing ? this.updateTodo : this.addTodo}

            className="btn-success mb-3 form-control"
            
            disabled={this.state.newTodo.length < 5}
            
            >

            {this.state.editing ? 'update todo' : 'Add to do'}

            
          </button>

          {
            this.state.loading && 
            <img src={loadingGif}  alt="Loading gif"/>
          }

          {
            (!this.state.editing || this.state.loading) && 
              <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return <ListItem
                
                  item={item}

                  editTodo={ () => {this.editTodo(index); }}

                  deleteTodo = {() => {this.deleteTodo(index)}}
                
                />;
              })}
            </ul>
          }
         
        </div>
      </div>
    );
  }
}

export default App;
