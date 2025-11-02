import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getTopRatedMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavourites";

const TopRatedMoviesPage = () => {
  // gets the "filter" part of the route eg.(/movies/topRated/thisYear)
  const { filter = "allTime" } = useParams();

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["topRatedMovies", filter], // will re-fetch automatically when filter changes
    queryFn: () => getTopRatedMovies(filter),
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data?.results || [];

  return (
    <PageTemplate//changes based on selected time frame
      title={`Top Rated Movies — ${
        filter === "allTime"
          ? "All Time"
          : filter === "thisYear"
          ? "This Year"
          : filter === "thisMonth"
          ? "This Month"
          : filter === "thisWeek"
          ? "This Week"
          : "Today"
      }`}
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    />
  );
};

export default TopRatedMoviesPage;