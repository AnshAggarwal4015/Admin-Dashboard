const SearchBar = ({ searchText, handleSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchText}
      onChange={handleSearch}
      className="mb-2 px-4 py-1 rounded-lg bg-gray-200 text-gray-700 text-base w-1/2 focus:outline-none focus:bg-gray-300 focus:shadow-md transition duration-300"
    />
  );
};

export default SearchBar;
