import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOVIE_API = 'https://www.omdbapi.com/?apikey=4a3b711b';
const PAGE_SIZE = 10;

const MovieApp: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [pageInput, setPageInput] = useState(page);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, [page, sort, order]);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const query = search.trim() ? `&s=${encodeURIComponent(search)}` : '&s=star';
      const res = await fetch(`${MOVIE_API}${query}&page=${page}`);
      const data = await res.json();
      if (data.Response === 'False') throw new Error(data.Error || 'No movies found.');
      setMovies(data.Search || []);
      setTotalResults(Number(data.totalResults) || 0);
    } catch (err: any) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (imdbID: string) => {
    if (expanded === imdbID) {
      setExpanded(null);
      setDetails(null);
      setDetailsError('');
      return;
    }
    setExpanded(imdbID);
    setDetailsLoading(true);
    setDetailsError('');
    try {
      const res = await fetch(`${MOVIE_API}&i=${imdbID}`);
      const data = await res.json();
      if (data.Response === 'False') throw new Error(data.Error || 'No details found.');
      setDetails(data);
    } catch (err: any) {
      setDetailsError(err.message);
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  const handleSort = (field: string) => {
    if (sort === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSort(field);
      setOrder('asc');
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    let aField = a[sort] || '';
    let bField = b[sort] || '';
    if (typeof aField === 'string') aField = aField.toLowerCase();
    if (typeof bField === 'string') bField = bField.toLowerCase();
    if (aField < bField) return order === 'asc' ? -1 : 1;
    if (aField > bField) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <span className="text-3xl">🎬</span>
        <h2 className="text-2xl font-extrabold text-blue-100 tracking-tight">Movies</h2>
      </div>
      <form className="flex gap-2 mb-6 max-w-2xl mx-auto" onSubmit={handleSearch}>
        <input
          className="border border-blue-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search movies..."
        />
        <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition" type="submit">
          Search
        </button>
      </form>
      <div className="flex gap-4 mb-4 items-center max-w-2xl mx-auto">
        <span className="font-semibold text-blue-100">Sort by:</span>
        <button className={`px-3 py-1 rounded ${sort === 'Title' ? 'bg-blue-400 text-white' : 'bg-gray-100'}`} onClick={() => handleSort('Title')}>Title</button>
        <button className={`px-3 py-1 rounded ${sort === 'Year' ? 'bg-blue-400 text-white' : 'bg-gray-100'}`} onClick={() => handleSort('Year')}>Year</button>
        <button className={`px-3 py-1 rounded ${sort === 'Type' ? 'bg-blue-400 text-white' : 'bg-gray-100'}`} onClick={() => handleSort('Type')}>Type</button>
      </div>
      {error && <div className="text-red-300 font-medium mb-4 flex items-center gap-2 justify-center"><span>⚠️</span>{error}</div>}
      {loading ? (
        <div className="text-center text-blue-200 font-bold">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[60vh] p-2 sm:p-4">
          {sortedMovies.map((movie) => (
            <div key={movie.imdbID} className="bg-white/95 rounded-2xl shadow-xl p-4 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition border-2 border-blue-900 w-full group">
              <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image'} alt={movie.Title} className="w-32 h-44 object-cover rounded mb-2 group-hover:shadow-lg transition" />
              <div className="font-bold text-blue-900 text-lg mb-1 text-center line-clamp-2">{movie.Title}</div>
              <div className="flex gap-2 text-xs text-gray-600 mb-1">
                <span className="bg-blue-100 rounded px-2 py-0.5">{movie.Year}</span>
                <span className="bg-blue-100 rounded px-2 py-0.5">{movie.Type}</span>
              </div>
              <div className="text-gray-500 text-xs text-center line-clamp-2 mb-2">{movie.Plot || ''}</div>
              <button
                className="mt-auto bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded shadow font-semibold transition"
                onClick={() => navigate(`/movies/${movie.imdbID}`)}
                aria-label={`See details for ${movie.Title}`}
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          className="px-3 py-1 rounded bg-blue-200 disabled:opacity-50 font-semibold"
          onClick={() => setPage(1)}
          disabled={page === 1}
          aria-label="First page"
        >⏮</button>
        <button
          className="px-3 py-1 rounded bg-blue-200 disabled:opacity-50 font-semibold"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >Prev</button>
        <form
          onSubmit={e => {
            e.preventDefault();
            if(pageInput >= 1 && pageInput <= totalPages) setPage(pageInput);
          }}
          className="flex items-center gap-1"
        >
          <label htmlFor="movie-page-input" className="sr-only">Page number</label>
          <input
            id="movie-page-input"
            name="page"
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={e => setPageInput(Number(e.target.value))}
            className="w-14 px-2 py-1 rounded border border-blue-300 text-center bg-white/80 font-semibold"
            placeholder="Page"
            aria-label="Page number"
          />
          <span className="text-blue-100 font-semibold">/ {totalPages || 1}</span>
        </form>
        <button
          className="px-3 py-1 rounded bg-blue-200 disabled:opacity-50 font-semibold"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Next page"
        >Next</button>
        <button
          className="px-3 py-1 rounded bg-blue-200 disabled:opacity-50 font-semibold"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Last page"
        >⏭</button>
      </div>
    </div>
  );
};

export default MovieApp;
