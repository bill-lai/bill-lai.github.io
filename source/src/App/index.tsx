import 'src/assets/style/reset.scss'
import 'src/assets/style/iconfont/iconfont.css'
import 'src/assets/style/public.scss'

import styles from './style.module.scss'
import * as React from 'react'
import { router,  homePath } from '../router'
import { 
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Slide from './layout/Slide'

const App = () => {
  const views = router.map(({path, Component}) => (
    <Route exact path={path} key={path}><Component /></Route>
  ))

  return (
    <React.StrictMode>
      <div className={styles.app}>
        <Slide className={styles.slide}></Slide>
        <div className={styles.body}>
          <Switch>
            {views}
            <Redirect to={homePath} />
          </Switch>
        </div>
      </div>
    </React.StrictMode>
  )
}

export default App