import * as React from 'react'
import style from './style.module.scss'
import { strToParams } from 'src/util'
import { githubApi } from 'src/request'

enum Step {
  UN,
  AUTH_ALLOW,
  AUTH_REFUSE,
  TOKEN_REQ,
  TOKEN_SUCCESS,
  TOKEN_ERR,
}

const stepMsg = {
  [Step.UN]: '',
  [Step.AUTH_ALLOW]: '已授权，正在获取信息',
  [Step.AUTH_REFUSE]: '拒绝授权，正在跳转中……',
  [Step.TOKEN_REQ]: '已授权，正在获取信息',
  [Step.TOKEN_SUCCESS]: '成功获取信息，正在跳转中……',
  [Step.TOKEN_ERR]: '获取信息失败，正在跳转中……',
}

const Auth = () => {
  const [step, setStep] = React.useState(Step.UN)
  const next = (newStep: Step) => {
    setStep(newStep)
    const gotoSteps = [
      Step.AUTH_REFUSE, 
      Step.TOKEN_SUCCESS, 
      Step.TOKEN_ERR
    ]

    if (gotoSteps.includes(newStep)) {
      setTimeout(() => {
        githubApi.recoveryHist()
      }, 2000)
    }
  }

  React.useEffect(() => {
    const { code } = strToParams(window.location.search)
    if (code) {
      next(Step.AUTH_ALLOW)
      githubApi.getToken(code)
        .then(data => {
          if (data) {
            next(Step.TOKEN_SUCCESS)
          } else {
            next(Step.TOKEN_ERR)
          }
        })
    } else {
      next(Step.AUTH_REFUSE)
    }
  }, [])

  return (
    <div className={style.layer}>
      <p>{stepMsg[step]}</p>
    </div>
  )
}

export default Auth