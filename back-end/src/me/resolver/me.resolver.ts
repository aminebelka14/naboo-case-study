import { Context, Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { UserService } from '../../user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { User } from 'src/user/user.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';
import { Activity } from 'src/activity/activity.schema';

@Resolver('Me')
export class MeResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getMe(@Context() context: ContextWithJWTPayload): Promise<User> {
    // the AuthGard will add the user to the context
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.userService.getById(context.jwtPayload.id);
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard)
  async GetFavoriteActivities(@Context() context: ContextWithJWTPayload): Promise<Activity[]> {
    const user = await this.userService.getById(context.jwtPayload.id);
    return await this.userService.getFavorites(user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async AddFavoriteActivity(
    @Args('activityId') activityId: string,
    @Context() context: ContextWithJWTPayload
  ): Promise<boolean> {
    await this.userService.addFavorite(context.jwtPayload.id, activityId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async RemoveFavoriteActivity(
    @Args('activityId') activityId: string,
    @Context() context: ContextWithJWTPayload
  ): Promise<boolean> {
    await this.userService.removeFavorite(context.jwtPayload.id, activityId);
    return true;
  }
}
