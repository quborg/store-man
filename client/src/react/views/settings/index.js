
export const MSG = {
  load: {
    client:   'En attente de client ..',
    product:  'En attente de produit ..',
    bag:      'En attente d\'embalage ..',
    basket:   'En attente de panier ..',
    order:    'En attente de commande ..'
  },
  arc: {
    client:   'Vous êtes sur le point d\'archiver le client suivant :',
    product:  'Vous êtes sur le point d\'archiver le produit suivant :',
    bag:      'Vous êtes sur le point d\'archiver l\'embalage suivant :',
    order:    'Vous êtes sur le point d\'archiver la Commande suivante :'
  },
  una: {
    client:   'Vous êtes sur le point de désarchiver le client suivant :',
    product:  'Vous êtes sur le point de désarchiver le produit suivant :',
    bag:      'Vous êtes sur le point de désarchiver l\'embalage suivant :',
    order:    'Vous êtes sur le point de désarchiver la Commande suivante :'
  },
  del: {
    client:   'Vous êtes sur le point de supprimer le client suivant :',
    product:  'Vous êtes sur le point de supprimer le produit suivant :',
    bag:      'Vous êtes sur le point de supprimer l\'embalage suivant :',
    order:    'Vous êtes sur le point de supprimer la Commande suivante :'
  }
}

export const ERRORS_STACK = {
  name      : 'SVP, choisir un nom correcte !',
  image     : 'SVP, choisir une image de format JPG ou PNG',
  firstname : 'SVP, choisir un prénom correcte !',
  lastname  : 'SVP, choisir un nom correcte !',
  phone     : 'SVP, choisir un numero valide !',
  email     : 'SVP, choisir un e-mail valide !',
  adress    : 'SVP, choisir une adress valide !',
  city      : 'SVP, choisir le nom d\'une ville valide !',
  products  : 'SVP, choisir au moin un produit !',
  client_id : 'SVP, choisir un client !',
  basket    : 'SVP, choisir au moin un produit !'
}

export const TableConf = {
  selectRowProp: (isArch, cb) => ({
    mode: 'radio',
    clickToSelect: true,
    bgColor: isArch ? '#AED581' : '#B2EBF2',
    onSelect: cb
  }),
  options: DISPLAY => ({
    sizePerPageList: [ 10, 100 ],
    sizePerPage: 10,
    sortName: 'created_at',
    sortOrder: 'desc',
    noDataText: MSG.load[DISPLAY]
  })
}
