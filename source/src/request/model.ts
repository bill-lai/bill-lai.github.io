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

export type Article = ArticleBase & {
  head: string | null,
  body: string,
  dirs: ArticleDirs
  foot: string | null,
}

export type Column = {
  id: string,
  title: string,
  desc?: string,
  articles: Array<ArticleBase>
}

export type ColumnList = Array<Column>

export type Columns = Array<Column>