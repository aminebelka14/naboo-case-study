import gql from "graphql-tag";

export const AddFavoriteActivity = gql`
  mutation AddFavoriteActivity($activityId: String!) {
    AddFavoriteActivity(activityId: $activityId)
  }
`;

export const RemoveFavoriteActivity = gql`
  mutation RemoveFavoriteActivity($activityId: String!) {
    RemoveFavoriteActivity(activityId: $activityId)
  }
`;