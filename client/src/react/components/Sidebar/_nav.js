export const nav = {
  items: [
    {
      title: true,
      name: 'Main de Gestion',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Gestion commandes',
      url: '/commandes',
      icon: 'fa fa-pie-chart'
      // badge: {
      //   variant: 'info',
      //   text: 'NEW'
      // }
    },
    {
      name: 'Historique clients',
      url: '/clients',
      icon: 'fa fa-users'
    },
    {
      name: 'Commandes semaine',
      url: '/commandes-semaine',
      icon: 'fa fa-shopping-basket'
    },
    {
      name: 'Tableau de bord',
      url: '/produits-semaine',
      icon: 'fa fa-edit'
    }
  ]
};
