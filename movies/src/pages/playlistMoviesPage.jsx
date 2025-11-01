import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";

import RemoveFromMustWatchIcon from "../components/cardIcons/removeFromPlaylist";
import AddReviewIcon from "../components/cardIcons/writeReview";

const PlaylistMoviesPage = () => {
  const { mustWatch: movieIds } = useContext(MoviesContext);

  const playlistMovieQueries = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: ["movie", { id: movieId }],
      queryFn: getMovie,
    })),
  });

  const isPending = playlistMovieQueries.some((q) => q.isPending);

  if (isPending) return <Spinner />;

  const movies = playlistMovieQueries
    .map((q) => q.data)
    .filter((movie) => movie)
    .map((movie) => ({
      ...movie,
      genre_ids: movie.genres?.map((g) => g.id) || [],
    }));

  return (
    <PageTemplate
      title="My Playlist"
      movies={movies}
      action={(movie) => (
        <>
          <RemoveFromMustWatchIcon movie={movie} />
          <AddReviewIcon movie={movie} />
        </>
      )}/>
  );
};

export default PlaylistMoviesPage;