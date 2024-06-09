import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  FormControl,
  TextField,
  List,
  OutlinedInput,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
} from "@mui/material";
import { addGenre, deleteGenre, getGenres } from "../utils/api_genres";
import { getAnimes } from "../utils/api_animes";
import AnimeCard from "../components/AnimeCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Add,
  Remove,
  Send,
} from "@mui/icons-material";
import Swal from "sweetalert2";

export default function AnimePage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [genre, setGenre] = useState("");
  const [newGenre, setNewGenre] = useState("");

  const [typing, setTyping] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const nav = useNavigate();

  const { data: animes = [] } = useQuery({
    queryKey: ["animes", search, genre, sort, token],
    queryFn: () => getAnimes(search, genre, sort, token),
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const addGenresMutation = useMutation({
    mutationFn: addGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
      setTyping(false);
      setNewGenre("");
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "Try again",
      });
    },
  });

  const handleAddGenre = () => {
    if (newGenre === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `Genre name should not be empty`,
        confirmButtonText: "Try again",
      });
    } else {
      addGenresMutation.mutate({ name: newGenre, token });
    }
  };

  const delGenreMutation = useMutation({
    mutationFn: deleteGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
      setTyping(false);
      setNewGenre("");
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "Try again",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete the genre?",
      text: "You won't be able to revert this!",
      icon: "warning",
      color: "#fff",
      background: "#17202A",
      showCancelButton: true,
      confirmButtonText: "Sure",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        delGenreMutation.mutate({ id, token });
      }
    });
  };

  if (!role && !token) {
    return (
      <>
        <Navbar />
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5">You need to login first</Typography>
          <Typography component={Link} to="/login">
            Go Login
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 3,
            flex: 1,
            gap: 1,
          }}
        >
          <FormControl sx={{ flex: 1 }}>
            <OutlinedInput
              type="text"
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <TextField
              type="text"
              select
              size="small"
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="popularity">Popularity</MenuItem>
            </TextField>
          </FormControl>
          {role === "Admin" && (
            <Button
              variant="contained"
              sx={{
                color: "white",
                bgcolor: "#17202A",
                "&:hover": {
                  bgcolor: "#1C2833",
                },
                fontWeight: "bold",
              }}
              size="large"
              onClick={() => {
                nav("/addAnime");
              }}
            >
              <Add />
            </Button>
          )}
        </Box>
        <List
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            maxWidth: "100%",
            p: 0,
            my: 1,
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": {
              display: "inherit",
              height: "10px",
              borderRadius: "10px",
              border: "1px solid #17202A",
              bgcolor: "white",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#17202A",
              borderRadius: "10px",
              border: "1px solid #17202A",
            },
          }}
        >
          {role === "Admin" && (
            <>
              <Box>
                <FormControl
                  sx={{
                    width: typing ? 300 : 65,
                  }}
                >
                  <OutlinedInput
                    size="small"
                    sx={{
                      color: typing ? "inherit" : "white",
                      bgcolor: typing ? "inherit" : "#17202A",
                      borderBottom: "none",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 25,
                      flexShrink: 0,
                    }}
                    value={newGenre}
                    placeholder={typing ? "Press enter after typing" : null}
                    startAdornment={
                      <InputAdornment>
                        <IconButton onClick={() => setTyping(!typing)}>
                          <Add
                            fontSize="small"
                            sx={{
                              transition:
                                "transform 0.5s ease, color 0.5s ease",
                              color: typing ? "inherit" : "white",
                              transform: typing
                                ? "rotate(45deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      typing && (
                        <InputAdornment>
                          <IconButton onClick={handleAddGenre}>
                            <Send fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                    onChange={(e) => setNewGenre(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Button
                onClick={() => setDeleting(!deleting)}
                size="small"
                sx={{
                  bgcolor: "#17202A",
                  color: "white",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                  "&:hover": {
                    bgcolor: "#212F3D",
                    color: "white",
                  },
                  flexShrink: 0,
                }}
              >
                <Remove
                  fontSize="small"
                  sx={{
                    transition: "transform 0.5s ease",
                    transform: deleting ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </Button>
            </>
          )}
          <Button
            onClick={() => setGenre("")}
            size="small"
            sx={{
              minWidth: 175,
              px: 2,
              bgcolor: genre === "" ? "#17202A" : "transparent",
              color: genre === "" ? "white" : "#17202A",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              "&:hover": {
                bgcolor: "#212F3D",
                color: "white",
              },
              flexShrink: 0,
            }}
          >
            All
          </Button>
          {genres &&
            genres.map((g) => (
              <>
                {!deleting ? (
                  <Button
                    size="small"
                    key={g._id}
                    onClick={(e) => setGenre(g._id)}
                    sx={{
                      minWidth: 175,
                      px: 2,
                      bgcolor: genre === g._id ? "#17202A" : "transparent",
                      color: genre === g._id ? "white" : "#17202A",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 25,
                      "&:hover": {
                        bgcolor: "#212F3D",
                        color: "white",
                      },
                      flexShrink: 0,
                    }}
                  >
                    {g.name}
                  </Button>
                ) : (
                  <Button
                    key={g._id}
                    size="small"
                    onClick={() => handleDelete(g._id)}
                    sx={{
                      minWidth: 175,
                      px: 2,
                      bgcolor: "#E74C3C",
                      color: "white",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    {g.name}
                  </Button>
                )}
              </>
            ))}
        </List>
        {animes.length > 0 ? (
          <Grid
            container
            sx={{
              alignItems: "center",
              width: "100%",
            }}
          >
            {animes.map((anime) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ display: "flex", justifyContent: "center", py: 1 }}
              >
                <AnimeCard anime={anime} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            height={350}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            py={"auto"}
          >
            <Typography variant="h5" textAlign={"center"}>
              No Anime Added Yet
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
