import * as config from './config'
import { InterfacesResponseConfig, SyntaxAxiosStatic } from './setup'
import Interface from './interface'

type a = InterfacesResponseConfig<Interface>
let c: a
// c.DELETE[0].response.
export default (axios: SyntaxAxiosStatic<Interface>) => {
  axios.delete('https://api.github.com/repos/:owner/:repo/issues/:id/reactions/:reactionId', {params: {id: 1, reactionId: 2, owner: '', repo: ''}, headers: {Authorization: '1'}})
    .then(res => {
      res
    })

  axios.addIntercept({
    urls: [
      config.article,
      config.articleReaction,
      config.articleReactions,
      config.authorize,
      config.columns
    ] as const,
    resHandler(res) {
      return res.data
    }
  })
  .get(config.article, {params: {id: '1'}})
    .then(res => {
      res
    })
}