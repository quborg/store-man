import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

const colors = {
  primary: x => x ? '#00bcd4' : '#00bcd4',
  warning: x => x ? '#FFC107' : '#FFD54F',
  danger : x => x ? '#E91E63' : '#F06292'
}

export const ButtonControl = ({icon, theme, title, onClick, disabled}) =>
  <RaisedButton onClick={() => onClick(theme, title)}
                className={(!disabled).toString()}
                backgroundColor={colors[theme](disabled)}
                icon={<i className={`fa fa-${icon} lead`} />}
  />
;

ButtonControl.defaultProps = {
  icon: '',
  theme: '',
  title: '',
  onClick: e => {}
}
