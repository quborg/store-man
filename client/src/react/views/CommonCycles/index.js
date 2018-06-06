import React, { Component } from 'react';

/**
* HOC for widgets getters/setters
*/
export default ViewComponent => {

  return class CommonCycle extends ViewComponent {

    constructor(props) {
      super(props)
    }

    state = {
      item: {},
      selected: false,
      isOpen: false,
      theme: '',
      isArch: false
    }

    onSelectItem = (item, selected) => {
      selected
      ? this.setState({item, selected})
      : this.setState({item: {}, selected})
    }

    resetSelection = () => {
      this.refs.table.cleanSelected()
      this.setState({ item: {}, selected: false })
    }

    openModal = (theme) => {
      this.setState({ isOpen: true, theme })
    }

    closeModal = () => {
      this.setState({ isOpen: false })
    }

    toggleArc = (e, isArch) => {
      this.setState({ isArch })
      this.resetSelection()
    }

    render() {
      return super.render()
    }

  }

}
