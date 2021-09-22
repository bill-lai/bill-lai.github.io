import styles from './style.module.scss'
import * as React from 'react'
import { 
  router, 
  homePath 
} from '../router'
import { 
  BrowserRouter as Router, 
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Slide from './layout/Slide'


const App: React.FC<{}> = () => {
  const views = router.map(({path, Component}) => (
    <Route path={path} key={path}><Component /></Route>
  ))

  return (
    <div className={styles.app}>
      <Router>
        <Slide className={styles.slide}></Slide>
        <Switch>
          {views}
          <Redirect to={homePath} />
        </Switch>
      </Router>
    </div>
  )
}

export default App