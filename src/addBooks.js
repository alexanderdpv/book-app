import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import ListBooks from './ListBooks'

class AddBooks extends Component {
  state = {
    query: '',
    queryResults: []
  }

  searchBooks(query) {
    this.setState({query})
    BooksAPI.search(this.state.query, 16).then((queryResults) => {
      this.setState({queryResults})
    })
  }

  onResultsChange = (e, book) => {
    console.log("Book: " + book)
    BooksAPI.update(book, e.target.value.toString()).then(() => {
      this.setState({ queryResults: [] })
      this.state.queryResults.map((book) => (
          BooksAPI.get(book.id).then((book) => {
          this.setState({ queryResults: this.state.queryResults.concat([ book ]) })
        })
      ))
    })
  }

  render() {
    // const { onChange } = this.props

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to='/'>Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" value={this.state.query} placeholder="Search by title or author" onChange={(e) => this.searchBooks(e.target.value)}/>
          </div>
        </div>
        <div className="search-books-results">
          <ListBooks onChange={(e) => this.onResultsChange()} books={this.state.queryResults}/>
        </div>
      </div>
    )
  }
}

export default AddBooks
