import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getUser } from "../utils/api_users";
import { useQuery } from "@tanstack/react-query";
import { url } from "../utils/url";

export default function UserProfile() {
  const { id } = useParams();

  const { data: user = {} } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(id),
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Card component={Paper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "black",
            }}
          >
            <Box sx={{ textAlign: "center", py: 3 }}>
              <img
                src={`${url}/profileImg/${user.profile}`}
                alt=""
                style={{
                  borderRadius: 100,
                  height: "100px",
                  width: "100px",
                  objectFit: "cover",
                }}
              />
              <Typography variant="h4" color="white" fontWeight="bold">
                {user.username}
              </Typography>
            </Box>
          </Box>
          <CardContent>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Email: {user.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Gender: {user.gender}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Role: {user.role}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Online: {user.isOnline ? "Yes" : "No"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
