import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovie, getMovieRecommendations, getMovieCredits} from "../api/tmdb-api";
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
    queryFn: () => getMovie({ queryKey: ["movie", { id }] }),//gets id
  });

  const {data: recData, error: recError, isPending: recPending, isError: recIsError} = useQuery({//for the above id, retrieves recommended movies
    queryKey: ["movieRecommendations", id],
    queryFn: () => getMovieRecommendations(id),
    enabled: !!id,
  });

   const { data: credits, isPending: creditsPending, isError: creditsError } = useQuery({
    queryKey: ["movieCredits", id],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const recommendedMovies = recData?.results || [];
  const actors = credits?.cast?.slice(0,20) || []; // gives the top 20 cast, by tmdbs order of cast

  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
            <MovieDetails movie={movie} />
          </PageTemplate>

          <div style={{ padding: "2rem" }}>{/* using movie id, retrieves the list of actors */}
            <h3>Actors</h3>

            {creditsPending && <Spinner />}
            {creditsError && <p style={{ color: "red" }}>{creditsError.message}</p>}

                <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "1rem",
                paddingBottom: "1rem",
              }}
            >
              {actors.map((actor) => (
                <div
                  key={actor.id}
                  style={{
                    minWidth: "120px",
                    textAlign: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={actor.name}
                    style={{
                      borderRadius: "8px",
                      width: "120px",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{actor.name}</p>
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>{actor.character}</p>
                </div>
              ))}
            </div>

            </div>

          <div style={{ padding: "2rem" }}>
            {/* recommended movies by parameter (id)*/}
                {/*movies is automatically filtered by genre, no code required (done by api)*/}
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