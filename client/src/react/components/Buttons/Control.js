import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

const $white = '#FFFFFF'
    , $p0 = '#00bcd4',  $p1 = '#00bcd4'
    , $w0 = '#FF9800',  $w1 = '#FFA726'
    , $d0 = '#E91E63',  $d1 = '#F06292'
    , $i0 = '#40C4FF',  $i1 = '#00B0FF'

const colors = {
  primary: x => x ? $p0 : $p1,
  warning: x => x ? $w0 : $w1,
  danger : x => x ? $d0 : $d1,
  info   : x => x ? $i0 : $i1
}

const icons = {
  primary: 'plus',
  warning: 'save',
  danger : 'trash',
  info   : 'info'
}

const themes = ['primary', 'warning', 'danger', 'info']


export const ButtonsControl = ({selected, openModal, display}) => themes.map( theme => {
                                let toAdd    = theme == 'primary'
                                  , toUpdate = theme == 'warning'
                                  , isInfo   = theme == 'info'
                                  , disabled;
                                display == 'panier'
                                ? (disabled = selected ? !toUpdate && !isInfo : true)
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
