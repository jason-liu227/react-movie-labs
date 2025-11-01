import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovie, getMovieRecommendations } from "../api/tmdb-api";
import PageTemplate from "../components/templateMoviePage";
import MovieDetails from "../components/movieDetails/";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavourites";
import MovieList from "../components/movieList";
import MovieListPageTemplate from "../components/templateMovieListPage";

const MoviePage = () => {
  const { id } = useParams();

  const {data: movie, error, isPending, isError} = useQuery({
    queryKey: ["movie", { id }],
    queryFn: () => getMovie({ queryKey: ["movie", { id }] }),
  });

  const {data: recData, error: recError, isPending: recPending, isError: recIsError} = useQuery({
    queryKey: ["movieRecommendations", id],
    queryFn: () => getMovieRecommendations(id),
    enabled: !!id,
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const recommendedMovies = recData?.results || [];

  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
            <MovieDetails movie={movie} />
          </PageTemplate>

          <div style={{ padding: "2rem" }}>
            <h3>Recommended Movies</h3>

            {recPending && <Spinner />}
            {recIsError && <p style={{ color: "red" }}>{recError.message}</p>}

            {recommendedMovies.length > 0 ? (
              <MovieList
                movies={recommendedMovies}
                action={(movie) => <AddToFavoritesIcon movie={movie} />}
              />
            ) : (
              !recPending && <p>No recommendations found.</p>
            )}
          </div>
        </>
      ) : (
        <p>Waiting for movie details...</p>
      )}
    </>
  );
};

export default MoviePage;