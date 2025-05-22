import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie>({} as Movie);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (selectedMovie: Movie) => {
    setIsModalOpen(true);
    setMovie(selectedMovie);
  };
  const closeModal = () => setIsModalOpen(false);

  function resetGrid() {
    setMovies([]);
  }

  const handleSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);
      setMovies(data);
    } catch {
      setIsError(true);
      resetGrid();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSubmit} resetGrid={resetGrid}></SearchBar>
      {isLoading && <Loader />}
      {movies.length > 0 ? (
        <MovieGrid movies={movies} onSelect={openModal} />
      ) : (
        <p>No movies found for your request.</p>
      )}
      {isError && <ErrorMessage />}
      {isModalOpen && <MovieModal movie={movie} onClose={closeModal} />}
    </div>
  );
}
