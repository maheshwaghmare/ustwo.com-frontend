'use strict';

import React from 'react';
import classnames from 'classnames';
import find from 'lodash/collection/find';
import map from 'lodash/collection/map';
import filter from 'lodash/collection/filter';
import get from 'lodash/object/get';
import kebabCase from 'lodash/string/kebabCase';
import spannify from 'app/lib/spannify';
import getFeaturedImage from 'app/lib/get-featured-image';
import renderModules from 'app/lib/module-renderer';
import getScrollTrackerMixin from 'app/lib/get-scroll-tracker-mixin';

import DownChevron from 'app/components/down-chevron';
import SVG from 'app/components/svg';
import Hero from 'app/components/hero';
import StudioJobs from 'app/components/studio-jobs';
import Rimage from 'app/components/rimage';
import Video from 'app/components/video';

const PageJoinUs = React.createClass({
  mixins: [getScrollTrackerMixin('join-us')],
  getInitialState() {
    return {
      studio: 'all-studios'
    };
  },
  render() {
    const { page } = this.props;
    const classes = classnames('page-join-us', this.props.className);
    const image = getFeaturedImage(page);

    return <article className={classes}>
      <Hero
        title={get(page, 'display_title')}
        transitionImage={true}
        eventLabel='join-us'
        showDownChevron={true}
      >
        <Video
          src={get(page, 'featured_video')}
          sizes={get(image, 'media_details.sizes')}
        />
      </Hero>
      {renderModules({
        modules: get(page, 'page_builder', []),
        colours: get(page, 'colors'),
        zebra: false,
        placeholderContents: {
          WORKABLE_LIST: this.renderJobSection
        }
      })}
    </article>;
  },
  getStudios() {
    return [{
      name: 'All studios'
    }].concat(this.props.studios);
  },
  renderStudioTabs() {
    return map(this.getStudios(), studio => {
      const id = kebabCase(studio.name);
      const name = spannify(studio.name);
      return <li
        key={`tab-${id}`}
        className={id}
        ref={`tab-${id}`}
        onClick={this.generateOnClickStudioHandler(id)}
        aria-selected={this.state.studio === id}
      >{name}</li>;
    });
  },
  generateOnClickStudioHandler(studio) {
    return () => {
      const el = React.findDOMNode(this.refs[`tab-${studio}`]);
      const tabs = this.getStudios().map(studio => {
        const id = kebabCase(studio.name);
        return React.findDOMNode(this.refs[`tab-${id}`]);
      });
      tabs.forEach(tab => tab.setAttribute('aria-selected', false));
      el.setAttribute('aria-selected', true);
      this.setState({
        studio: studio
      });
    }
  },
  renderJobSection() {
    const sizes = { hardcoded: { url: '/images/joinus/current_openings.jpg' }};

    return <div>
      <div className="current-openings">
        <h2>Current Openings</h2>
      </div>
      <section className="jobs">
        <nav className="jobs-studio-tabs">
          {this.renderStudioTabs()}
        </nav>
        <div className="jobs-container">
          {this.renderStudioJobs()}
        </div>
      </section>
      <div className="benefits">
        <h2>Some of the benefits...</h2>
      </div>
    </div>;
  },
  renderStudioJobs() {
    return map(this.getStudios(), studio => {
      const id = kebabCase(studio.name);
      return <StudioJobs
        key={`jobs-${id}`}
        studio={studio}
        studios={this.props.studios}
        jobs={this.getJobsForStudio(studio)}
        selected={this.state.studio === id}
        contactEmail={get(find(get(find(get(this.props, 'footer.contacts', []), 'type', 'general'), 'methods', []), 'type', 'email'), 'uri', '')}
      />;
    });
  },
  getJobsForStudio(studio) {
    const allJobs = this.props.jobs || [];
    const { name } = studio;
    let jobs;
    if (name === 'All studios') {
      jobs = allJobs;
    } else {
      jobs = filter(allJobs, job => {
        const studioMatchesCity = get(job, 'location.city', '') === name;
        const studioMatchesRegion = (get(job, 'location.region') || '').includes(name);
        return studioMatchesCity || studioMatchesRegion;
      });
    }
    return jobs;
  }
});

export default PageJoinUs;
