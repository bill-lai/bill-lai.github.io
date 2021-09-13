import styles from './style.module.scss'
import { 
  router, 
  homePath 
} from '../router'
import { 
  HashRouter as Router, 
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Slide from './layout/Slide'

function App() {
  const views = router.map(({path, Component}) => (
    <Route path={path} key={path}><Component /></Route>
  ))

  return (
    <div className={styles.app}>
      <Router>
        <Slide className={styles.slide}></Slide>
        <div className={styles.content}>
          <Switch>
            {views}
            <Redirect to={homePath} />
          </Switch>
        </div> 
      </Router>
    </div>
  )
}

export default App