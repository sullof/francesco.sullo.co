import Extra from './Extra'

class Note extends React.Component {

  render() {

    let data = this.props.data
    let i = 0
    let paragraphs = data.body.map(p => <p key={'p_key_' + i++} dangerouslySetInnerHTML={{__html: p}}/>)

      return <div lassName={'noteBody'}>{paragraphs}</div>

  }
}

export default Note


