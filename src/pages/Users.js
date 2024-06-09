import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  TableContainer,
  TableFooter,
  TableRow,
  TableBody,
  Container,
  Typography,
  Paper,
  FormControl,
  Box,
  TextField,
  Button,
  Table,
  Divider,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getUsers, getUser } from "../utils/api_users";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { url } from "../utils/url";

export default function UsersPage() {
  const nav = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { _id } = currentUser;

  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);

  const { data: users = [] } = useQuery({
    queryKey: ["users", username, page],
    queryFn: () => getUsers(username, page),
  });

  const { data: current = {} } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(_id),
  });

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ flexDirection: "column" }}>
          <Box sx={{ display: "flex", gap: 1, marginY: "10px" }}>
            <FormControl sx={{ flex: 2 }}>
              <TextField
                size="small"
                label="Username"
                placeholder="Search User"
                name="Search"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setPage(1);
                }}
              />
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {users.map((user) => {
                  if (user.role !== "Admin")
                    return (
                      <TableRow
                        onClick={() => nav(`/users/${user._id}`)}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 3,
                          py: 2,
                        }}
                        key={user._id}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            textAlign: "center",
                            gap: 1,
                          }}
                        >
                          <img
                            src={`${url}/profileImg/${user.profile}`}
                            style={{
                              height: "40px",
                              width: "40px",
                              borderRadius: 100,
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                          <Typography
                            variant="h6"
                            fontWeight={"bold"}
                            fontStyle={"italic"}
                          >
                            {user.username}
                          </Typography>
                        </Box>
                        {user.isOnline ? (
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "green",
                            }}
                          ></div>
                        ) : (
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "red",
                            }}
                          ></div>
                        )}
                      </TableRow>
                    );
                })}
              </TableBody>
              <Divider />
              <TableFooter>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    onClick={() => {
                      page !== 1 && setPage(page - 1);
                    }}
                  >
                    Previous
                  </Button>
                  <Typography>Page {page}</Typography>

                  <Button
                    onClick={() => {
                      users.length === 10 && setPage(page + 1);
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
