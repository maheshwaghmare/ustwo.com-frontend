'use strict';

import React from 'react';
import classnames from 'classnames';
import TransitionManager from 'react-transition-manager';
import find from 'lodash/collection/find';
import map from 'lodash/collection/map';
import filter from 'lodash/collection/filter';
import pluck from 'lodash/collection/pluck';
import includes from 'lodash/collection/includes';
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
import JobsStudioDetail from 'app/components/jobs-studio-detail';
import JobsStudioImage from 'app/components/jobs-studio-image';
import JobsList from 'app/components/jobs-list';
import Rimage from 'app/components/rimage';
import Video from 'app/components/video';
import Flux from 'app/flux';

function getSelectedStudio(studioSlugFromUrl, studioSlugs) {
  let selected = 'london';
  if(includes(studioSlugs, studioSlugFromUrl)) {
    selected = studioSlugFromUrl;
  }
  return selected;
}

const PageJoinUs = React.createClass({
  mixins: [getScrollTrackerMixin('join-us')],
  render() {
    const { page, currentParams, studios, openJobItem } = this.props;
    const classes = classnames('page-join-us', this.props.className);
    const image = getFeaturedImage(page);
    const studioSlugFromUrl = get(currentParams, 'lid');
    const studioSlugs = map(pluck(studios, 'name'), kebabCase);
    const selectedStudioSlug = getSelectedStudio(studioSlugFromUrl, studioSlugs);

    return (
      <article className={classes}>
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
            WORKABLE_LIST: this.getJobSectionRenderer(selectedStudioSlug)
          }
        })}
      </article>
    );
  },
  componentDidUpdate() {
    const { jobItemOpen } = this.props;

    const activeTab = React.findDOMNode(this.refs.activeTab);
    const tabUnderline = React.findDOMNode(this.refs.underline);
    const studioJobs = React.findDOMNode(this.refs.studioJobs);
    // const infoHeight = studioTab.querySelector('div', '[class="jobs-studio-info"]').offsetHeight;
    const jobsListHeight = studioJobs.querySelector('ul', '[class="jobs-list"]').offsetHeight;

    tabUnderline.style.width = `${activeTab.offsetWidth}px`;
    tabUnderline.style.left = `${activeTab.offsetLeft}px`;

    if (document.body.offsetWidth > 767) {
      studioJobs.style.height = `${jobsListHeight}px`;
    }
  },
  handleClick() {
    let getStudioTabs = React.findDOMNode(this.refs.studioTabs);
    getStudioTabs.classList.remove('animate');
    setTimeout(() => {
      getStudioTabs.classList.add('animate')
    }, 0);
  },
  renderStudioTabs(selectedStudioSlug) {
    let studioSelectedBackgroundColor;
    const tabs = map(this.props.studios, studio => {
      let studioSelectedColor;
      const studioSlug = kebabCase(studio.name);
      const studioName = spannify(studio.name);
      const uri = `/join-us/${studioSlug}`;
      if (studioSlug === selectedStudioSlug) {
        studioSelectedColor = {color: studio.color}
        studioSelectedBackgroundColor = {backgroundColor: studio.color}
      }

      return (
        <div
          key={`tab-${studioSlug}`}
          aria-selected={studioSlug === selectedStudioSlug}
          className={`tab ${studioSlug} ${studioSlug === selectedStudioSlug ? 'active' : ''}`}
          ref={studioSlug === selectedStudioSlug ? 'activeTab' : ''}
          onClick={this.handleClick.bind(this)}
          style={studioSelectedColor}>
          <a
            href={uri}
            onClick={Flux.overrideNoScroll(uri)}>{studioName}</a>
        </div>
      );
    });

    return (
      <nav className="jobs-studio-tabs" ref="studioTabs">
        {tabs}
        <div className="underline" style={studioSelectedBackgroundColor} ref="underline"></div>
      </nav>
    );
  },
  getJobSectionRenderer(selectedStudioSlug) {

    let studioDetail;
    let studioImage;
    let joblist;
    map(this.props.studios, studio => {
      const studioSlug = kebabCase(studio.name);
      if (studioSlug === selectedStudioSlug) {
        studioDetail = (
          <JobsStudioDetail
            key={`studio-detail-${studioSlug}`}
            studio={studio} />
        );
        const image = getFeaturedImage(studio);
        studioImage = (
          <JobsStudioImage
            key={`studio-image-${studioSlug}`}
            image={image}
            studio={studio} />
        );
        joblist = (
          <JobsList
            key={`jobs-${studioSlug}`}
            studio={studio}
            ref="jobsList"
            studios={this.props.studios}
            jobs={this.getJobsForStudio(studio)}
            contactEmail={get(find(get(find(get(this.props, 'footer.contacts', []), 'type', 'general'), 'methods', []), 'type', 'email'), 'uri', '')} />
        );
      }
    });


    if (document.body.offsetWidth < 768) {
      return () => {
        return (
          <div key="job-section">
            <div className="current-openings">
              <h2>We're Hiring</h2>
            </div>
            <section className="jobs">
              {map(this.props.studios, studio => {
                const studioSlug = kebabCase(studio.name);
                return (
                  <div className="jobs-container">
                    <div className="studio-info">
                      {studioDetail}
                      {studioImage}
                    </div>
                    {joblist}
                  </div>
                );
              })}
            </section>
          </div>
        );
      }
    } else {
      return () => {
        const sizes = { hardcoded: { url: '/images/joinus/current_openings.jpg' }};

        return (
          <div key="job-section">
            <div className="current-openings">
              <h2>We're Hiring</h2>
            </div>
            <section className="jobs">
              <div className="jobs-container">
                {this.renderStudioTabs(selectedStudioSlug)}
                <div className="studio-info">
                  <TransitionManager
                    component="div"
                    duration={640}
                    className="studio-detail"
                    ref="studioDetail">
                    {studioDetail}
                  </TransitionManager>
                  <TransitionManager
                    component="div"
                    duration={640}
                    className="studio-image"
                    ref="studioImage">
                    {studioImage}
                  </TransitionManager>
                </div>
                <TransitionManager
                  component="div"
                  duration={640}
                  className="studio-jobs"
                  ref="studioJobs">
                  {joblist}
                </TransitionManager>
              </div>
            </section>
          </div>
        );
      };
    }
  },
  getJobsForStudio(studio) {
    const allJobs = this.props.jobs || [];
    const { name } = studio;
    return filter(allJobs, job => {
      const studioMatchesCity = get(job, 'location.city', '') === name;
      const studioMatchesRegion = (get(job, 'location.region') || '').includes(name);
      return studioMatchesCity || studioMatchesRegion;
    });
  }
});

export default PageJoinUs;
