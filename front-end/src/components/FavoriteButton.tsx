import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useQuery } from "@apollo/client";
import {
  AddFavoriteActivity,
  RemoveFavoriteActivity,
} from "../graphql/mutations/favorites/handleFavorites";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import GetFavoriteActivities from "../graphql/queries/activity/getFavoriteActivities";

type Props = {
  activityId: string;
};

export const FavoriteButton: React.FC<Props> = ({ activityId }) => {
  const router = useRouter();
  const { user } = useAuth();

  const { data, refetch } = useQuery(GetFavoriteActivities, {
    fetchPolicy: "network-only",
    skip: !user,
  });

  const [addFavorite] = useMutation(AddFavoriteActivity);
  const [removeFavorite] = useMutation(RemoveFavoriteActivity);

  const isFavorite =
    data?.GetFavoriteActivities?.some((fav: any) => fav.id === activityId) ??
    false;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite({ variables: { activityId } });
      } else {
        await addFavorite({ variables: { activityId } });
      }
      await refetch();
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 2,
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <IconHeartFilled color="red" /> : <IconHeart />}
    </button>
  );
};
