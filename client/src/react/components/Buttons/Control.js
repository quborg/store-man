import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Toggle from 'material-ui/Toggle'

const $white = '#FFFFFF'
    , $gray1 = '#f0f3f5'
    , $gray2 = '#c2cfd6'
    , $p0 = '#00bcd4',  $p1 = '#00bcd4'
    , $w0 = '#FF9800',  $w1 = '#FFA726'
    , $s0 = '#c2cfd6',  $s1 = '#a4b7c1'
    , $l0 = '#AED581',  $l1 = '#8BC34A'
    , $d0 = '#E91E63',  $d1 = '#F06292'
    , $i0 = '#40C4FF',  $i1 = '#00B0FF'

const colors = {
  primary   : d => d ? $gray2 : $p1,
  warning   : d => d ? $gray2 : $w1,
  secondary : d => d ? $gray2 : $s1,
  success   : d => d ? $gray2 : $l1,
  danger    : d => d ? $gray2 : $d1,
  info      : d => d ? $gray2 : $i1
}

const icons = {
  primary   : 'plus',
  warning   : 'edit',
  secondary : 'folder',
  success   : 'folder-open',
  danger    : 'trash',
  info      : 'info'
}


const themes = ['primary', 'warning', 'secondary', 'success', 'danger', 'info']

const toggleProps = flag => flag  ? {
                                      thumbSwitchedStyle: {backgroundColor: '#689F38'},
                                      trackSwitchedStyle: {backgroundColor: '#AED581'}
                                    } : {}


export const ButtonsControl = ({archived, selected, openModal, display, isArch, toggleArc}) =>

    <div className='fx fx-je fx-ae fx-rev pt-3 ops-btns'>
      {
        [
          ...themes.reduce( (buttons, theme) => {
            let toAdd  = theme == 'primary'
              , toEdit = theme == 'warning'
              , toArch = theme == 'secondary'
              , toUnar = theme == 'success'
              , toDel  = theme == 'danger'
              , toInfo = theme == 'info'
              , isBasket = display == 'panier'
              , disabled = !selected
              , mixArchBtn = (isArch && toArch) || (!isArch && toUnar)
              , noArch     = ['client','commande'].indexOf(display) < 0
              , noButton   = noArch && toArch

            if (toAdd)    disabled = !toAdd
            if (isBasket) disabled = selected ? !toEdit && !toInfo : true
            if (toArch)   disabled = noArch ? !selected : false
            if (toDel)    disabled = noArch ? !selected : !(selected && isArch && archived)
            if (isArch)   disabled = ! (selected && (toUnar || toDel || toInfo) && archived)

            disabled = selected && toInfo ? false : disabled

            if ( !mixArchBtn )
              buttons.push(<RaisedButton
                            key={`${theme}-boa-ctl`}
                            onClick={() => openModal(theme)}
                            className={'op-btn '+(!disabled).toString()}
                            backgroundColor={colors[theme](disabled)}
                            icon={<i className={`fa fa-${icons[theme]} lead`} />}
                          />)

            return buttons
          }, []),
          display == 'client' || display == 'commande'
          ? [
              <i key='sep-boa-ctl' className='fa fa-ellipsis-v sep-clr sepa font-4xl' />,
              <Toggle key='arc-tog-boa-ctl' {...toggleProps(isArch && selected)} label="Archives" className={`btn-toggle arc ${isArch&&selected?'active':''}`} onToggle={toggleArc} />
            ]
          : null
        ]
      }
    </div>


ButtonsControl.defaultProps = {
  archived: false,
  selected: false,
  isArch: false,
  display: '',
  openModal: () => {},
  toggleArc: () => {}
}
