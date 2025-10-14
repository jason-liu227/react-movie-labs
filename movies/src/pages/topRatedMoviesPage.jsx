import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopRatedMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavourites";

const TopRatedMoviesPage = () => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["topRatedMovies"], 
    queryFn: getTopRatedMovies, 
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data.results || [];

  const favorites = movies.filter((m) => m.favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  const addToFavorites = (movieId) => true;

  return (
    <PageTemplate
      title="Top Rated Movies"
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    />
  );
};

export default TopRatedMoviesPage;