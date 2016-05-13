'use strict';

import React from 'react';
import classnames from 'classnames';
import get from 'lodash/object/get';

import Rimage from 'app/components/rimage';

const JobsStudioInfo = React.createClass({
  render() {
    const { studio, image, className } = this.props;

    return (
      <div className={`jobs-studio-info ${className}`}>
        <div className="info" style={{ backgroundColor: studio.color }}>
          <p className="excerpt">{get(studio, 'recruitment-title')}</p>
          <p className="studio-blurb">{get(studio, 'recruitment-desc')}</p>
        </div>
        <Rimage
          className="photo"
          wrap="div"
          sizes={get(image, 'media_details.sizes')}
          altText={get(image, 'alt_text')} />
      </div>
    );
  }
});

export default JobsStudioInfo;
