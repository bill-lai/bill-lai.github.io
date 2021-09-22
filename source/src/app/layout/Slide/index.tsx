import * as React from 'react'
import { homePath, queryRoutePath } from 'src/router'
import { Link } from 'react-router-dom'
// import portrait from 'src/assets/images/portrait.jpg'
import portrait from 'src/assets/images/test.jpg'
import styles from './style.module.scss'

interface navType {
  text: string,
  path: string
}
type navsType = Array<navType>

const navsConfig: navsType = [
  { text: '首页', path: homePath },
  { text: '专题', path: queryRoutePath('archive') },
  { text: '归档', path: queryRoutePath('special') }
]

type SlideProps = {
  className: string
}

const Slide: React.FC<SlideProps> = (props) => {
  const navs = navsConfig.map(({text, path}) =>(
    <li key={path}>
      <Link to={path}>{text}</Link>
    </li>
  ))

  return (
    <header className={`${props.className || ''} ${styles.slide}`}>
      <Link to={homePath}>
        <img src={portrait}  className={styles.portrait} alt="portrait" />
      </Link>
      <div className={styles.content}>
        <div className={styles.introduce}>
          <h1>
            <Link to={homePath}>Jerry Qu</Link>
          </h1>
          <p>专注 WEB 端开发</p>
        </div>
        <ul className={styles.navs}>
          {navs}
        </ul>
      </div>
    </header>
  )
}

export default Slide