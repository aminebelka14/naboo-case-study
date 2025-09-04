import { PageTitle } from "@/components";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Container, Flex, Grid, Text, Group, Select, ActionIcon } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import Head from "next/head";
import { useQuery } from "@apollo/client";
import { Activity } from "../components/Activity";
import GetFavoriteActivities from "../graphql/queries/activity/getFavoriteActivities";
import { EmptyData } from "../components/EmptyData";
import { useState } from "react";

type SortOption = 'city' | 'name' | 'price';

const Profile = () => {
  const { user } = useAuth();
  const { data } = useQuery(GetFavoriteActivities, {
    fetchPolicy: "network-only",
  });
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isAscending, setIsAscending] = useState(true);

  const favorites = [...(data?.GetFavoriteActivities ?? [])].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'city':
        comparison = a.city.localeCompare(b.city);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      default:
        return 0;
    }

    return isAscending ? comparison : -comparison;
  });

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

      <Flex justify="space-between" align="center" mt="xl" mb="md">
        <h2>Mes activités favorites</h2>
        <Group spacing="xs">
          <Select
            placeholder="Trier par"
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
            data={[
              { value: 'city', label: 'Ville' },
              { value: 'name', label: 'Nom de l\'activité' },
              { value: 'price', label: 'Prix' },
            ]}
            style={{ width: 200 }}
          />
          <ActionIcon 
            variant="light"
            onClick={() => setIsAscending(!isAscending)}
            title={isAscending ? "Ordre croissant" : "Ordre décroissant"}
          >
            {isAscending ? <IconSortAscending size={18} /> : <IconSortDescending size={18} />}
          </ActionIcon>
        </Group>
      </Flex>

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
