import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

const colors = {
  primary: x => x ? '#00bcd4' : '#00bcd4',
  warning: x => x ? '#FFC107' : '#FFD54F',
  danger : x => x ? '#E91E63' : '#F06292'
}

const icons = {
  primary: 'plus',
  warning: 'save',
  danger : 'trash'
}

const themes = ['primary', 'warning', 'danger']


export const ButtonsControl = ({selected, openModal, display}) => themes.map( theme => {
                                let toAdd    = theme == 'primary'
                                  , toUpdate = theme == 'warning'
                                  , disabled;
                                display == 'panier'
                                ? (disabled = selected ? !toUpdate : true)
                                : (disabled = !selected && !toAdd)
                                return  <RaisedButton
                                          key={`${theme}-boa-ctl`}
                                          onClick={() => openModal(theme)}
                                          className={(!disabled).toString()}
                                          backgroundColor={colors[theme](disabled)}
                                          icon={<i className={`fa fa-${icons[theme]} lead`} />}
                                        />
                              })


ButtonsControl.defaultProps = {
  selected: false,
  display: '',
  openModal: () => {}
}
