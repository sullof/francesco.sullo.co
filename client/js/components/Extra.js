class Extra extends React.Component {

  render() {

    let data = this.props.data

    return (
      <div className="extra" dangerouslySetInnerHTML={{__html: data.extra}} />
    )

  }
}

export default Extra


