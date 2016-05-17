'use strict';

import React from 'react';
import classnames from 'classnames';
import get from 'lodash/object/get';

const JobsStudioDetail = React.createClass({
  render() {
    const { studio, className } = this.props;

    return (
      <div className={`jobs-studio-detail ${className}`}>
        <div className="info" style={{ backgroundColor: studio.color }}>
          <p className="excerpt">{get(studio, 'recruitment-title')}</p>
          <p className="studio-blurb">{get(studio, 'recruitment-desc')}</p>
        </div>
      </div>
    );
  }
});

export default JobsStudioDetail;
