import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetFavoriteActivities = gql`
  query GetFavoriteActivities {
    GetFavoriteActivities {
      ...Activity
    }
  }
  ${ActivityFragment}
`;

export default GetFavoriteActivities;