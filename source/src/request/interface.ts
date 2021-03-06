import {
  article,
  columns,
  userInfo,
  token,
  comments,
  articleReactions,
  articleReaction,
  authorize,
  commentReactions,
  commentReaction,
  comment
} from './config'

import {
  Article,
  ColumnList,
  UserInfo,
  Comment,
  CommentList,
  Reaction,
  Reactions,
  ReactionContent
} from './model'


type GitHubAuth = {
  headers: { Authorization: string }
}

type GitHubBaseReq = {
  paths: {
    owner: string,
    repo: string,
  }
}

type GithubReactionBaseReq = GitHubBaseReq & {
  paths: { id: number }
}

type GithubCommentBaseReq = GitHubBaseReq & {
  paths: { issuesId: number }
}

export type Interfaces = {
  GET: [
    {
      url: typeof article,
      paths: { id: string },
      response: Article
    },
    {
      url: typeof columns,
      response: ColumnList
    },
    GitHubAuth & {
      url: typeof userInfo,
      response: UserInfo
    },
    {
      url: typeof authorize,
      params: {
        client_id: string,
        redirect_uri: string,
        scope: string
      }
    },
    GithubCommentBaseReq & {
      url: typeof comments,
      response: CommentList
    },
    GithubReactionBaseReq & {
      url: typeof articleReactions,
      response: Reactions
    },
    GithubReactionBaseReq & {
      url: typeof commentReactions,
      response: Reactions
    },
  ],
  POST: [
    {
      url: typeof token,
      data: {
        client_id: string,
        client_secret: string,
        code: string
      },
      response: string
    },
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof articleReactions,
      data: {
        content: ReactionContent
      },
      response: Reaction
    },
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof commentReactions,
      data: {
        content: ReactionContent
      },
      response: Reaction
    },
    GithubCommentBaseReq & {
      url: typeof comments,
      data: {
        body: string
      },
      response: Omit<Comment, 'reactions'>
    },
  ],
  PATCH: [
    GitHubAuth & {
      url: typeof comment,
      paths: {
        commentId: string
      },
      data: {
        body: string
      }
    }
  ],
  DELETE: [
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof articleReaction,
      paths: {
        reactionId: number
      }
    },
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof commentReaction,
      paths: {
        reactionId: number
      }
    },
    GitHubAuth & {
      url: typeof comment,
      paths: {
        commentId: string
      }
    },

  ]
}


export default Interfaces