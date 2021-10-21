import {
  article,
  columns,
  userInfo,
  token,
  comment,
  articleReactions,
  articleReaction,
  authorize
} from './config'

import {
  Article,
  ColumnList,
  UserInfo,
  CommentList,
  Reaction,
  Reactions,
  ReactionContent
} from './model'


type GitHubAuth = {
  headers: { Authorization: string }
}

type GitHubBaseReq = {
  params: {
    owner: string,
    repo: string,
  }
}

type GithubReactionBaseReq = GitHubBaseReq & {
  params: { id: number }
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
    GitHubBaseReq & {
      url: typeof comment,
      params: { labels?: string },
      response: CommentList
    },
    GithubReactionBaseReq & {
      url: typeof articleReactions,
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
    GitHubBaseReq & {
      url: typeof comment,
      data: {
        body: string,
        labels: Array<string>
      }
    },
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof articleReactions,
      data: {
        content: ReactionContent
      },
      response: Reaction
    },
  ],
  DELETE: [
    GitHubAuth & GithubReactionBaseReq & {
      url: typeof articleReaction,
      params: {
        reactionId: number
      }
    }
  ]
}


export default Interfaces