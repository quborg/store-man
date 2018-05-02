import React, { Component } from 'react'
import {Container, Row} from 'reactstrap'

export default class Embalages extends Component {

  render() {
    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>[ LES PANIERS ]</h2>
            </div>
          </Row>
        </Container>
      </div>
    )
  }

}
