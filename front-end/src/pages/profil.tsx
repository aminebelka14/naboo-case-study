import { PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Container, Flex, Grid, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useQuery } from "@apollo/client";
import { Activity } from "../components/Activity";
import GetFavoriteActivities from "../graphql/queries/activity/getFavoriteActivities";
import { EmptyData } from "../components/EmptyData";

const Profile = () => {
  const { user } = useAuth();
  const { data, loading } = useQuery(GetFavoriteActivities, {
    fetchPolicy: "network-only",
  });

  const favorites = data?.GetFavoriteActivities ?? [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="xl">
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      <Flex align="center" gap="md">
        <Avatar color="cyan" radius="xl" size="lg">
          {user?.firstName[0]}
          {user?.lastName[0]}
        </Avatar>
        <Flex direction="column">
          <Text>{user?.email}</Text>
          <Text>{user?.firstName}</Text>
          <Text>{user?.lastName}</Text>
        </Flex>
      </Flex>

      <h2>Mes activités favorites</h2>

      <Grid>
        {favorites.length > 0 ? (
          favorites.map((activity: any) => (
            <Activity activity={activity} key={activity.id} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
    </Container>
  );
};

export default withAuth(Profile);
