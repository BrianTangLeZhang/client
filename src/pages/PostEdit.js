import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
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
import { FileUpload } from "@mui/icons-material";
import { editPost, getPost } from "../utils/api_posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function PostEdit() {
  const { id } = useParams();
  const queryclient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [ann, setAnn] = useState(false);

  const { data: post = {} } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags ? post.tags.join(" ") : "");
      setAnn(post.announcement || false);
    }
  }, [post]);

  const nav = useNavigate();

  const [cookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookie;
  const { token, role } = currentUser;

  const UploadButton = styled("input")({ height: 0, width: 0 });

  const editPostMutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully edited post",
        showConfirmButton: false,
        timer: 1500,
      });
      queryclient.invalidateQueries({
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
    } else if (content === "" && !images[0] && !post.images[0]) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Type some content or upload an image",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        color: "#fff",
        background: "#17202A",
        showCancelButton: true,
        confirmButtonText: "Yes, edit it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed)
          editPostMutation.mutate({
            id: post._id,
            title: title,
            content: content,
            tags: tags,
            images: images,
            announcement: ann,
            token: token,
          });
      });
    }
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
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Edit Post
            </Typography>
            <Grid
              container
              component="form"
              method="Post"
              encType="multipart/form-data"
              sx={{ px: 4, py: 4, gap: 4 }}
            >
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
              {role === "Admin" && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <small>Announcement</small>
                  <Checkbox
                    checked={ann}
                    onChange={(e) => {
                      setAnn(e.target.checked);
                    }}
                  />
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="upload-files">
                  <UploadButton
                    type="file"
                    accept="image/*"
                    id="upload-files"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                  />
                  <Button
                    component="span"
                    sx={{
                      bgcolor: "#273746",
                      color: "white",
                      border: "0px",
                      "&:hover": {
                        bgcolor: "#34495E",
                      },
                      height: "60px",
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    New Images?
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"end"}
                gap={1}
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
                  Update
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
