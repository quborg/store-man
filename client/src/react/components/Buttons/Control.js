import React from 'react'


export const ButtonControl = ({icon, theme, title, onClick, disabled}) =>
  <button type='button' {...{disabled}}
          className={`fx fx-ae px-4 btn btn-${theme}`}
          onClick={() => onClick(theme, title)} >
    <i className={`fa fa-${icon} lead`}></i>
  </button>
;

ButtonControl.defaultProps = {
  icon: 'circle-thin',
  theme: 'light',
  title: '',
  onClick: e => {}
}
