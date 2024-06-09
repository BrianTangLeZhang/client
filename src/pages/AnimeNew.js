import {
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  styled,
  Checkbox,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getGenres } from "../utils/api_genres";
import { useState } from "react";
import { FileUpload } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { addAnime } from "../utils/api_animes";

export default function AnimeNew() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState([]);
  const [poster, setPoster] = useState([]);
  const [background, setBackground] = useState([]);
  const [cookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookie;
  const { token, role } = currentUser;

  const handleGenresChange = (e) => {
    setGenre(
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value
    );
  };

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const UploadButton = styled("input")({ display: "none" });

  const imageHandler = (e) => {
    setPoster(e.target.files[0]);
  };

  const bgHandler = (e) => {
    setBackground(e.target.files[0]);
  };

  const addAnimeMutation = useMutation({
    mutationFn: addAnime,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully added an anime",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["animes"],
      });
      nav("/animes");
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

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      genre.length === 0 ||
      poster.length === 0 ||
      background.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
      });
    } else {
      addAnimeMutation.mutate({
        name,
        description,
        genres: genre.join(", "),
        poster,
        background,
        token,
      });
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 3,
              }}
            >
              Add New Anime
            </Typography>
            <Grid container sx={{ paddingX: 4, paddingY: 4, gap: 4 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Name"
                  variant="outlined"
                  value={name}
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  fullWidth
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Genres</InputLabel>
                  <Select
                    required
                    value={genre}
                    label="Genres"
                    multiple
                    onChange={handleGenresChange}
                    renderValue={(selected) => selected.join(", ")}
                    sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                  >
                    {genres.map((g) => (
                      <MenuItem key={g._id} value={g.name}>
                        <Checkbox checked={genre.indexOf(g.name) > -1} />
                        <ListItemText primary={g.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="upload-poster">
                  <UploadButton
                    type="file"
                    id="upload-poster"
                    accept="image/*"
                    onChange={imageHandler}
                  />
                  <Button
                    component="span"
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                      color: "white",
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Upload Poster
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="upload-background">
                  <UploadButton
                    type="file"
                    id="upload-background"
                    accept="image/*"
                    onChange={bgHandler}
                  />
                  <Button
                    component="span"
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                      color: "white",
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Upload Background
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                gap={2}
                justifyContent={"end"}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "#17202A",
                    border: "2px solid #212F3D",
                    "&:hover": {
                      border: "2px solid #212F3D",
                    },
                  }}
                  onClick={() => nav("/animes")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#17202A",
                    "&:hover": {
                      bgcolor: "#212F3D",
                    },
                    color: "white",
                  }}
                  onClick={(e) => handlerSubmit(e)}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
