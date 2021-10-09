export type ArticleBase = {
  id: string,
  title: string,
  desc?: string,
  mtime: number,
  ctime: number
}

export type ArticleDir = { 
  title: string, 
  leave: number,
  children: Array<ArticleDir> 
} 
export type ArticleDirs = Array<ArticleDir> 

export type ArticleTemp = null | {
  body: string,
  dirs: ArticleDirs
}

export type Article = ArticleBase & {
  head: ArticleTemp,
  body: string,
  dirs: ArticleDirs
  foot: ArticleTemp,
  issues: {
    number: number
  },
  column: {
    id: string,
    title: string
  }
}

export type Column = {
  id: string,
  title: string,
  desc?: string,
  articles: Array<ArticleBase>
}

export type ColumnList = Array<Column>

export type Columns = Array<Column>

export type UserInfo = {
  avatar_url: string,
  created_at: string,
  html_url: string,
  id: number
  login: string
  type: string
}

export type Commit = {
  id: string,
  number: number,
  title: string,
  user: UserInfo,
  labels: Array<string>,
  body: string,
  created_at: string,
  reactions: []
}

export type Reaction = {
  content: '+1' | '-1',
  created_at: string,
  id: number,
  user: UserInfo
}

export type Reactions = Array<Reaction>


export type CommitList = Array<Commit>