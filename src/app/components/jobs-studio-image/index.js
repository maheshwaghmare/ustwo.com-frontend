'use strict';

import React from 'react';
import classnames from 'classnames';
import get from 'lodash/object/get';

import Rimage from 'app/components/rimage';

const JobsStudioImage = React.createClass({
  render() {
    const { studio, image, className } = this.props;
    return (
      <div className={`jobs-studio-image ${className}`}>
        <Rimage
          className="photo"
          wrap="div"
          sizes={get(image, 'media_details.sizes')}
          altText={get(image, 'alt_text')} />
      </div>
    );
  }
});

export default JobsStudioImage;
