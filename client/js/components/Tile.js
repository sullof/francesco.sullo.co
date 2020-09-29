import Soundcloud from './Soundcloud'
import Vimeo from './Vimeo'
import Picture from './Picture'
import Socials from './Socials'
import Book from './Book'

class Tile extends React.Component {

  render() {

    let data = this.props.data
    let content = <div/>

    if (data.type === 'soundcloud') {

      content = <Soundcloud
        data={data}
      />
    } else if (data.type === 'vimeo') {

      content = <Vimeo
        data={data}
      />
    } else if (data.type === 'picture') {

      content = <Picture
        data={data}
      />
    } else if (data.type === 'socials') {

      content = <Socials
        data={data}
      />
    }else if (data.type === 'book') {

      content = <Book
        data={data}
      />
    }

    return (
      <li>
        {data.what || data.year ?
          <div className="lihead">
            <div className="what">{data.what}</div>
            <div className="year">{data.year}</div>
            <br style={{clearAfter: 'both'}}/>
          </div>
          : null
        }
        {content}
        {
          data.title ? <div className="lititle">{data.title}
            {data.subtitle ? <div className="liinfo">{data.subtitle}</div> : null}</div> : null
        }
      </li>
    )
  }
}

export default Tile


