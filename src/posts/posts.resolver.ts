import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';

import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { CreatePostInput } from './dto/createPost.input';
import { PostsPaginationConnectorInput } from './dto/post-connector.input';
import { Post } from './models/post.model';
import { PostConnection } from './models/post-connection.model';

const pubSub = new PubSub();

@Resolver(() => Post)
export class PostsResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Post)
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @UserEntity() user: User,
    @Args('data') data: CreatePostInput
  ) {
    const newPost = this.prisma.post.create({
      data: {
        published: true,
        title: data.title,
        content: data.content,
        authorId: user.id,
      },
    });
    pubSub.publish('postCreated', { postCreated: newPost });
    return newPost;
  }

  @Query(() => PostConnection)
  async publishedPosts(@Args('input') input: PostsPaginationConnectorInput) {
    const { orderBy, query, after, before, first, last, skip, take } = input;
    const paginateWithoutCursorCondition = !first && !last && !before && !after;

    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: {
            published: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
          ...(paginateWithoutCursorCondition && { skip, take }),
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );

    return a;
  }

  @Query(() => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query(() => Post)
  async post(@Args() id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } });
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}