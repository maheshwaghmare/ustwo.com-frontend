'use strict';

import React from 'react';
import classnames from 'classnames';
import get from 'lodash/object/get';
import map from 'lodash/collection/map';
import pluck from 'lodash/collection/pluck';
import includes from 'lodash/collection/includes';
import kebabCase from 'lodash/string/kebabCase';
import spannify from 'app/lib/spannify';
import Flux from 'app/flux';

const EventsControls = React.createClass({
  getStudios() {
    const { studios } = this.props;
    if(studios) {
      return [{
        name: 'All studios'
      }].concat(studios);
    } else {
      return [{
        name: 'All studios'
      }];
    }
  },
  componentDidUpdate() {
    const activeTab = React.findDOMNode(this.refs.activeTab);
    const tabUnderline = React.findDOMNode(this.refs.underline);

    tabUnderline.style.width = `${activeTab.offsetWidth}px`;
    tabUnderline.style.left = `${activeTab.offsetLeft}px`;
  },
  getSelectedStudio(studioSlugFromUrl, studioSlugs) {
    let selected = 'all-studios';
    if(includes(studioSlugs, studioSlugFromUrl)) {
      selected = studioSlugFromUrl;
    }
    return selected;
  },
  generateStudioUri(studio) {
    const uri = studio !== 'all-studios' ? '?studio='+studio : '';
    return `/events${uri}`;
  },
  handleClick() {
    let getStudioTabs = React.findDOMNode(this.refs.studioTabs);
    getStudioTabs.classList.remove('animate');
    setTimeout(() => {
      getStudioTabs.classList.add('animate')
    }, 0);
  },
  render() {
    const { currentParams, studios } = this.props;
    const studioSlugFromUrl = get(currentParams, 'studio');
    const studioSlugs = map(pluck(studios, 'name'), kebabCase);
    const selectedStudioSlug = this.getSelectedStudio(studioSlugFromUrl, studioSlugs);

    let studioSelectedBackgroundColor;
    const tabs = map(this.getStudios(), studio => {
      const studioSlug = kebabCase(studio.name);
      const studioName = spannify(studio.name);
      const uri = this.generateStudioUri(studioSlug);
      let studioSelectedColor;
      if (studioSlug === selectedStudioSlug) {
        studioSelectedColor = {color: studio.color}
        studioSelectedBackgroundColor = {backgroundColor: studio.color}
      }
      return (
        <div
          key={`tab-${studioSlug}`}
          className={`tab ${studioSlug} ${studioSlug === selectedStudioSlug ? 'active' : ''}`}
          ref={studioSlug === selectedStudioSlug ? 'activeTab' : ''}
          style={studioSelectedColor}
          onClick={this.handleClick.bind(this)}
          aria-selected={studioSlug === selectedStudioSlug}>
          <a href={uri} onClick={Flux.overrideNoScroll(uri)}>{studioName}</a>
        </div>
      );
    });

    return (
      <div className="events-controls" ref="studioTabs">
        {tabs}
        <div className="underline" style={studioSelectedBackgroundColor} ref="underline"></div>
      </div>
    );
  }
});

export default EventsControls;
