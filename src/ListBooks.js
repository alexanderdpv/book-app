import React, { Component } from 'react';

class ListBooks extends Component {
  render () {
    const { shelf, onChange, books } = this.props;
    const booksOnShelf = books.filter(book => book.shelf === shelf);

    return (
      <ol className="books-grid">
        {booksOnShelf.map((book) => (
          <li key={book.id}>
            <div className="book">
              <div className="book-top">
                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})`}}></div>
                <div className="book-shelf-changer">
                  <select value={book.shelf} onChange={(e) => onChange(e, book)}>
                    <option value="" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div className="book-title"><span>{book.title}</span></div>
              <div className="book-authors"><span>{book.authors}</span></div>
            </div>
          </li>
        ))}
      </ol>
    )
  }
}

export default ListBooks
