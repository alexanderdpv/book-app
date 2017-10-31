import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import AddBooks from './addBooks'
import './App.css'

class BooksApp extends React.Component {
  state = {
    booksOnShelf: [],
    searchResults: [],
    searchQuery: ""
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ booksOnShelf: books });
    })
  }

  searchBooks = (query) => {
    this.setState({ searchQuery: query });
    BooksAPI.search(this.state.searchQuery, 10).then((searchResults) => {
      if (!searchResults) {
        this.setState({ searchResults: [] });
      } else {
        var modResults = this.state.searchResults.map((b) => {
            var shelfBookEq = this.state.booksOnShelf.filter((shelfBook) => shelfBook.id === b.id ); // ERROR: Cannot find the equivalent book locally
            if (shelfBookEq) {
              b.shelf = shelfBookEq.shelf;
            } else {
              b.shelf = "none";
            }
          });
        this.setState({ searchResults: modResults });
      }
    })
  }

  onShelfChange = (e, book) => {
      // Remove book from current shelf, update database
      BooksAPI.update(book, e.target.value).then(() => {
        this.setState({ booksOnShelf: this.state.booksOnShelf.filter((b) => b.id !== book.id)});
        // Add book to new shelf
        BooksAPI.get(book.id).then((book) => {
          this.setState({ booksOnShelf: this.state.booksOnShelf.concat(book) });
        });
      });
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
                    <ListBooks shelf="currentlyReading" books={this.state.booksOnShelf} onChange={this.onShelfChange}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks shelf="wantToRead" books={this.state.booksOnShelf} onChange={this.onShelfChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks shelf="read" books={this.state.booksOnShelf} onChange={this.onShelfChange} />
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
          <AddBooks searchResults={this.state.searchResults} searchQuery={this.state.searchQuery} onShelfChange={this.onShelfChange} onBookSearch={this.searchBooks}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
