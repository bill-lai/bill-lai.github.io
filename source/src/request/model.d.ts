export type ArticleBase = {
  id: number,
  title: string,
  desc?: string,
  time: Date
}

export type Article = ArticleBase & {
  head?: string,
  body: string,
  foot?: string,
}

export type Column = {
  id: number,
  title: string,
  desc?: string,
  articles: Array<ArticleBase>
}

export type Columns = Array<Column>