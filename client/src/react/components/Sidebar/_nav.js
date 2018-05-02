import moment from 'moment'

const day1    = moment().day(1).format('DD/MM')
    , day2    = moment().day(7).format('DD/MM')
    , period  = `${day1} au ${day2}`


export const nav = {
  items: [
    {
      title: true,
      name: 'Main de Gestion',
      wrapper: {              // optional wrapper object
        element: '',          // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''               // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Historique clients',
      url: '/clients',
      icon: 'fa fa-users'
    },
    {
      name: 'Tous les produits',
      url: '/produits',
      icon: 'fa fa-th'
    },
    {
      name: 'Les embalages',
      url: '/embalages',
      icon: 'fa fa-shopping-bag',
      class: 'disabled'
    },
    {
      name: 'Les paniers',
      url: '/paniers',
      icon: 'fa fa-shopping-basket'
    },
    {
      name: 'Gestion de commandes',
      url: '/commandes',
      icon: 'fa fa-pie-chart'
    },
    {
      name: 'Commandes de la semaine ' + period,
      url: '/commandes-semaine',
      icon: 'fa fa-th-list'
    }
  ]
}
