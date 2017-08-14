import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import AddBooks from './addBooks'
import './App.css'

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        currentlyReading: books.filter((book) => book.shelf === 'currentlyReading')
      })
      this.setState({
        wantToRead: books.filter((book) => book.shelf === 'wantToRead')
      })
      this.setState({
        read: books.filter((book) => book.shelf === 'read')
      })
    })
  }

  onShelfChange = (e, book) => {
    this.setState((state) => ({
      currentlyReading: state.currentlyReading.filter((b) => b.id !== book.id),
      wantToRead: state.wantToRead.filter((b) => b.id !== book.id),
      read: state.read.filter((b) => b.id !== book.id)
    }))

    if (e.target.value === 'currentlyReading') {
      BooksAPI.update(book, 'currentlyReading').then(() => {
        BooksAPI.get(book.id).then((book) => {
          this.setState((state) => ({
            currentlyReading: state.currentlyReading.concat([ book ])
          }))
        })
      })
    }

    if (e.target.value === 'wantToRead') {
      BooksAPI.update(book, 'wantToRead').then(() => {
        BooksAPI.get(book.id).then((book) => {
          this.setState((state) => ({
            wantToRead: state.wantToRead.concat([ book ])
          }))
        })
      })
    }

    if (e.target.value === 'read') {
      BooksAPI.update(book, 'read').then(() => {
        BooksAPI.get(book.id).then((book) => {
          this.setState((state) => ({
            read: state.read.concat([ book ])
          }))
        })
      })
    }
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ListBooks books={this.state.currentlyReading} onChange={this.onShelfChange}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks books={this.state.wantToRead} onChange={this.onShelfChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks books={this.state.read} onChange={this.onShelfChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )}/>
        <Route path='/search' render={() => (
          <AddBooks onChange={this.onShelfChange}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
