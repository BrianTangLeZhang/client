import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Grid,
  Card,
  Box,
  CardContent,
  TextField,
  styled,
  Checkbox,
} from "@mui/material";
import { addPost } from "../utils/api_posts";
import { FileUpload } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function PostNew() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [ann, setAnn] = useState(false);
  const nav = useNavigate();

  const [cookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookie;
  const { token, role } = currentUser;

  const UploadButton = styled("input")({ height: 0, width: 0 });

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully add new post",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      nav("/");
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
    if (title === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Title shouldn't be empty",
        confirmButtonText: "OK",
      });
    } else if (content === "" && !images[0]) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Type some content or upload an image",
        confirmButtonText: "OK",
      });
    } else {
      addPostMutation.mutate({
        title: title,
        content: content,
        tags: tags,
        images: images,
        announcement: ann,
        token: token,
      });
    }
  };

  if (!role && !token) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">You need to login first</Typography>
        <Typography component={Link} to="/login">
          Go Login
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add New Post
            </Typography>
            <Grid container sx={{ paddingX: 4, paddingY: 4, gap: 4 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Title"
                  variant="outlined"
                  value={title}
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Content"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={content}
                  fullWidth
                  onChange={(e) => setContent(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Tags"
                  variant="outlined"
                  value={tags}
                  type="text"
                  fullWidth
                  helperText="ex.(#A #B #C)"
                  onChange={(e) => setTags(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {role === "Admin" && (
                  <>
                    <small>Announcement</small>
                    <Checkbox
                      checked={ann}
                      onChange={(e) => {
                        setAnn(e.target.checked);
                      }}
                    />
                  </>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="upload-files">
                  <UploadButton
                    id="upload-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                  />
                  <Button
                    component="span"
                    fullWidth
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Images
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "end", gap: 2 }}
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
                  onClick={() => nav("/")}
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
