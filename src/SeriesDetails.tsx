import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SERIES_API = 'https://www.omdbapi.com/?apikey=4a3b711b';

const SeriesDetails: React.FC = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${SERIES_API}&i=${imdbID}`);
        const data = await res.json();
        if (data.Response === 'False') throw new Error(data.Error || 'No details found.');
        setSeries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [imdbID]);

  if (loading) return <div className="text-center text-purple-600 font-bold mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 font-bold mt-10">{error}</div>;
  if (!series) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700 p-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl p-6 max-w-2xl w-full flex flex-col md:flex-row gap-8">
        <img src={series.Poster !== 'N/A' ? series.Poster : 'https://via.placeholder.com/200x300?text=No+Image'} alt={series.Title} className="w-40 h-60 object-cover rounded-xl shadow-md mx-auto md:mx-0 border-2 border-purple-900" />
        <div className="flex-1 flex flex-col justify-center">
          <div className="font-bold text-purple-900 text-3xl mb-2">{series.Title}</div>
          <div className="flex flex-wrap gap-3 mb-2 text-gray-700">
            <span className="bg-purple-200 rounded px-2 py-1 text-sm">{series.Year}</span>
            <span className="bg-purple-200 rounded px-2 py-1 text-sm">{series.Type}</span>
            <span className="bg-purple-200 rounded px-2 py-1 text-sm">IMDB: {series.imdbRating}</span>
          </div>
          <div className="mb-1 text-gray-800"><span className="font-semibold">Genre:</span> {series.Genre}</div>
          <div className="mb-1 text-gray-800"><span className="font-semibold">Director:</span> {series.Director}</div>
          <div className="mb-1 text-gray-800"><span className="font-semibold">Actors:</span> {series.Actors}</div>
          <div className="mb-2 text-gray-800"><span className="font-semibold">Plot:</span> {series.Plot}</div>
          <button className="mt-4 bg-purple-700 hover:bg-purple-900 text-white px-4 py-2 rounded shadow font-semibold transition w-fit" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
