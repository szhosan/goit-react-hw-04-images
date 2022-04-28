import { useState } from 'react';
import s from './Searchbar.module.css';
import PropTypes from 'prop-types';

function SearchBar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const onFormSubmit = e => {
    e.preventDefault();
    onSubmit(searchQuery);
  };

  return (
    <header className={s.searchbar}>
      <form className={s.form} onSubmit={onFormSubmit}>
        <button type="submit" className={s.button}>
          <span className={s.label}>Search</span>
        </button>
        <input
          className={s.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
        />
      </form>
    </header>
  );
}

SearchBar.propTypes = { onSubmit: PropTypes.func.isRequired };

export default SearchBar;
