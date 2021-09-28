export type ArticleBase = {
  id: number,
  title: string,
  desc?: string,
  time: Date
}

type ArticleDir = { 
  title: string, 
  children: Array<ArticleDir> 
} 

export type Article = ArticleBase & {
  head?: string,
  body: string,
  dirs: Array<ArticleDir>
  foot?: string,
}

export type Column = {
  id: number,
  title: string,
  desc?: string,
  articles: Array<ArticleBase>
}

export type ColumnList = Array<Column>

export type Columns = Array<Column>