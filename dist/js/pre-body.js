if (/^www\.sullo/.test(location.host)) {
  location.replace(`${location.protocol}//${location.host.replace(/^www/,'francesco')}${location.pathname}${location.hash}`)
} else if (/^www\.francesco/.test(location.host)) {
  location.replace(`${location.protocol}//${location.host.replace(/^www\./,'')}${location.pathname}${location.hash}`)
} else if (/^sullo\./.test(location.host)) {
  location.replace(`${location.protocol}//${location.host.replace(/^sullo\./,'francesco.sullo.')}${location.pathname}${location.hash}`)
}
