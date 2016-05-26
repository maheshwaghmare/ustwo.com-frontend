'use strict';

import React from 'react';
import classnames from 'classnames';
import map from 'lodash/collection/map';
import kebabCase from 'lodash/string/kebabCase';
import spannify from 'app/lib/spannify';
import Flux from 'app/flux';

const Tabs = React.createClass({
  componentDidUpdate() {
    const activeTab = React.findDOMNode(this.refs.activeTab);
    const tabUnderline = React.findDOMNode(this.refs.underline);

    tabUnderline.style.width = `${activeTab.offsetWidth}px`;
    tabUnderline.style.left = `${activeTab.offsetLeft}px`;
  },
  handleClick() {
    let getStudioTabs = React.findDOMNode(this.refs.studioTabs);
    getStudioTabs.classList.remove('animate');
    setTimeout(() => {
      getStudioTabs.classList.add('animate');
    }, 0);
  },
  render() {
    const { page, studios, selected } = this.props;
    let studioSelectedBackgroundColor;
    const tabs = map(studios, studio => {
      let studioSelectedColor;
      const studioSlug = kebabCase(studio.name);
      const studioName = spannify(studio.name);

      let uri;
      if (page === 'join-us') {
        console.log("joinus page");
        uri = `/join-us/${studioSlug}`;
      }
      if (page === 'events') {
        let slug = studioSlug !== 'all-studios' ? '?studio='+studioSlug : '';
        uri = `/events${slug}`;
      }

      if (studioSlug === selected) {
        studioSelectedColor = {color: studio.color}
        studioSelectedBackgroundColor = {backgroundColor: studio.color}
      }

      return (
        <div
          key={`tab-${studioSlug}`}
          aria-selected={studioSlug === selected}
          className={`tab ${studioSlug} ${studioSlug === selected ? 'active' : ''}`}
          ref={studioSlug === selected ? 'activeTab' : ''}
          onClick={this.handleClick.bind(this)}
          style={studioSelectedColor}>
          <a
            href={uri}
            onClick={Flux.overrideNoScroll(uri)}>{studioName}</a>
        </div>
      );
    });

    return (
      <div className="tabs" ref="studioTabs">
        {tabs}
        <div className="underline" style={studioSelectedBackgroundColor} ref="underline"></div>
      </div>
    );
  }
});

export default Tabs;
