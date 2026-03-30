import { useState, useRef, useEffect } from 'react'

export default function SearchBar({ onSearch, recentSearches = [], loading }) {
  const [input, setInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const filtered = recentSearches.filter((s) =>
    s.toLowerCase().includes(input.toLowerCase())
  )

  function handleSubmit(e) {
    e.preventDefault()

    if (input.trim()) {
      onSearch(input.trim())
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  function handleSelect(city) {
    setInput(city)
    setShowDropdown(false)
    onSearch(city)
  }

  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="search-wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <span className="search-icon"></span>

          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search city..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            disabled={loading}
            autoComplete="off"
          />

          {input && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setInput('')
                inputRef.current?.focus()
              }}
            >
              &times;
            </button>
          )}
        </div>

        <button
          type="submit"
          className="search-btn"
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {showDropdown && filtered.length > 0 && (
        <ul className="search-dropdown" ref={dropdownRef}>
          {filtered.map((city) => (
            <li key={city}>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSelect(city)}
              >
                <span className="dropdown-icon"></span>
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}