import style from './style.module.scss'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function ColumnItem(props) {
  const articles = props.articles.map(({title, link, time}, i) =>(
    <li className={style['article-item']} key={i}>
      <Link to={link}>{title}</Link>
      <span>{time}</span>
    </li>
  ))

  return (
    <div className={style.layer}>
      <h2 className={style.title}>{props.title}</h2>
      { props.desc && <p>{props.desc}</p>  }
      <ul>
        { articles }
      </ul>
    </div>
  )
}

ColumnItem.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      time: PropTypes.object
    })
  )
}

export default ColumnItem