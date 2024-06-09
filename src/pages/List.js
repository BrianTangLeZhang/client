import { useCookies } from "react-cookie";
import Navbar from "../components/Navbar";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserList } from "../utils/api_lists";
import AnimeCard from "../components/AnimeCard";

export default function UserFavouriteList() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["list"],
    queryFn: () => getUserList(token),
  });

  if (isLoading)
    return (
      <>
        <Navbar />
        <Container
          sx={{ display: "flex", justifyContent: "center", height: 500 }}
        >
          <CircularProgress />
        </Container>
      </>
    );

  return (
    <>
      <Navbar />
      <Container>
        <Grid container spacing={2} py={4}>
          {!list.length ? (
            <Grid
              xs={12}
              height={200}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Add your favourite anime to here
              </Typography>
            </Grid>
          ) : (
            <>
            <Grid
              xs={12}
              height={50}
            >
              <Typography variant="h6" fontSize={30} fontWeight={"bold"}>
                Your favourite animes: 
              </Typography>
            </Grid>
              {list.map((anime) => (
                <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AnimeCard anime={anime} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
}
