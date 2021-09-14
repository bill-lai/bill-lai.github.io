// -------------文章----------------
export const getArticle = `a`

// -------------类别-----------------
export const getColumn = `b`

// -------------评论-------------------
export const getComment = `c`




export type ConfigType = {
  [getArticle]: {
    method: 'GET',
    params: { id: number },
    response: {
      code: number,
      data: number
    }
  }
}