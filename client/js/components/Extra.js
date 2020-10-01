class Extra extends React.Component {

  render() {

    let data = this.props.data

    return (
      <div className="extra">
        <ReactMarkdown source={data.extra}/>
      </div>
    )

  }
}

export default Extra


