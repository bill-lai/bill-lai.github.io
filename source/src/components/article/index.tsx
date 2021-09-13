import { ArticleSimpleType } from '../article-item'

export interface ArticleType extends ArticleSimpleType {
  head?: string,
  foot?: string,
}