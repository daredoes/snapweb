import React from 'react';
import PropTypes from 'prop-types'
import AppWrapper from './WrapTopLevelProvider'

export const wrapRootElement = ({ element }) => (
  <AppWrapper>{element}</AppWrapper>
)

wrapRootElement.propTypes = {
  element: PropTypes.node,
}
