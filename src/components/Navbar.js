import {
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../utils/api_users";
import Swal from "sweetalert2";
import { url } from "../utils/url";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const nav = useNavigate();
  const [cookies, removeCookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token, image, _id } = currentUser;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const queryClient = useQueryClient();

  let pageTitle = "Welcome to AnimeX";

  useEffect(() => {
    if (!role) {
      const target = localStorage.getItem("user");
      if (target) {
        logoutMutation2.mutate(target);
      }
    }
  }, []);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully logged-out",
        showConfirmButton: false,
        timer: 1500,
      });
      removeCookie(["currentUser"]);
      localStorage.removeItem("user");
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

  const logoutMutation2 = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: "users",
      });
      localStorage.removeItem("user");
      alert("Your token is expired");
    },
    onError: (e) => {
      console.log(`${e.response.data.msg}`);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(token);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#17202A",
        position: "sticky",
        top: 0,
        zIndex: "999",
      }}
    >
      <Box sx={{ paddingY: 1, position: "relative" }}>
        <Typography
          variant="h3"
          component={Link}
          to={"/"}
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {pageTitle}
        </Typography>
        <IconButton
          sx={{
            height: "30px",
            width: "30px",
            position: "absolute",
            borderRadius: 100,
            right: 20,
            padding: 0,
            overflow: "hidden",
          }}
          onClick={handleClick}
        >
          {!role || !token ? (
            <Avatar sx={{ height: "30px", width: "30px" }} />
          ) : (
            <img
              src={`${url}/profileImg/${image}`}
              alt="Profile"
              style={{ height: "30px", width: "30px", objectFit: "cover" }}
            />
          )}
        </IconButton>
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {!role ? (
          <>
            <MenuItem onClick={() => nav("/register")}>Sign Up</MenuItem>
            <MenuItem onClick={() => nav("/login")}>Sign In</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => nav(`/users/${_id}`)}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Button
          component={Link}
          to="/"
          sx={{
            flex: 1,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "capitalize",
            color: "white",
            bgcolor: location.pathname === "/" ? "#212F3D" : "#17202A",
            "&:hover": {
              bgcolor: "#1C2833",
            },
          }}
        >
          Post
        </Button>
        <Button
          component={Link}
          to="/animes"
          sx={{
            flex: 1,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "capitalize",
            color: "white",
            bgcolor: location.pathname === "/animes" ? "#212F3D" : "#17202A",
            "&:hover": {
              bgcolor: "#1C2833",
            },
          }}
        >
          Anime
        </Button>
        <Button
          component={Link}
          to="/users"
          sx={{
            flex: 1,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "capitalize",
            color: "white",
            bgcolor: location.pathname === "/users" ? "#212F3D" : "#17202A",
            "&:hover": {
              bgcolor: "#1C2833",
            },
          }}
        >
          User
        </Button>
        {role && (
          <Button
            component={Link}
            to="/lists"
            sx={{
              flex: 1,
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "capitalize",
              color: "white",
              bgcolor: location.pathname === "/lists" ? "#212F3D" : "#17202A",
              "&:hover": {
                bgcolor: "#1C2833",
              },
            }}
          >
            List
          </Button>
        )}
      </Box>
    </Box>
  );
}
