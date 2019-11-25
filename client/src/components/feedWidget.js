import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import FeedArea from './feedArea';
import './feedWidget.css'

class FeedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCount: 1,
      pending: 'true',
      data: [],
      paged: 1,
      limit: 6,
    }

    this.timer = this.timer.bind(this);
    this.trackScrolling = this.trackScrolling.bind(this);
  }

  compare(a, b) {
    const dataA = a.date;
    const dateB = b.date;

    let comparison = 0;
    if (dataA < dateB) {
      comparison = 1;
    } else if (dataA > dateB) {
      comparison = -1;
    }
    return comparison;
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling() {
    const wrappedElement = document.getElementById('feed-area-image');
    if (this.isBottom(wrappedElement)) {
      const currentPaged = this.state.paged + 1;
      this.setState({
        paged: currentPaged
      })

      this.props.onStateChange("no-active");
      if (Array.isArray(this.props.feedurl)) {
        const feedList = this.props.feedurl.map((url) => {
          return url.url + '?paged=' + this.state.paged + 1;
        })

        let index = 0;
        for (var i = 0; i < feedList.length; i++) {
          try {
            axios.post('/api/feed/' + this.props.feedurl[i].version, { url: feedList[i] })
              .then(({ data: { data: feedData } }) => {
                index++;
                let { data } = this.state;
                data = [...data, ...feedData];
                this.setState({
                  pending: false,
                  data
                })
                if (index === feedList.length) {
                  this.props.onStateChange("active");
                }
              })
              .catch(err => {
                console.log(err)
              })
          } catch (error) {
            console.log("error", error)
          }
        }
      } else {
        try {
          this.setState({
            pending: true,
          })
          axios.post('/api/feed/' + this.props.version, { url: this.props.feedurl + '?paged=' + this.state.paged + 1 })
            .then(({ data: { data: feedData } }) => {
              let { data } = this.state;
              data = [...data, ...feedData];
              this.setState({
                pending: false,
                data
              })
              this.props.onStateChange("active");
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  };

  timer() {
    const newCount = this.state.currentCount - 1;
    if (newCount >= 0) {
      this.setState({ currentCount: newCount });
    } else {
      const { main } = this.props;
      if (main) {
        // const feedList = feedurl.map((url) => {
        //   return url.url;
        // })

        try {
          // let index = 0;
          this.props.onStateChange("no-active");
          // for (var i = 0; i < feedList.length; i++) {
            axios.post('/api/feeds/all.rss',)
              .then(({ data: { data: feedData } }) => {
                // index++;
                let { data } = this.state;
                data = [...data, ...feedData];
                this.setState({
                  pending: false,
                  data
                })
                // if (index === feedList.length) {
                  this.props.onStateChange("active");
                // }
              })
              .catch(err => {
                console.log(err)
              })
          // }
        } catch (error) {
          console.log("error", error)
        }
      }
      clearInterval(this.state.intervalId);
    }
  }

  componentDidMount() {
    this.setState({
      data: [],
      paged: 1
    })

    this.props.onStateChange("no-active");
    this.setState({ pending: true })
    axios.post('/api/feeds/all.rss')
      .then(({ data: { data: feedData } }) => {
        let { data } = this.state;
        data = [...data, ...feedData];
        this.setState({
          pending: false,
          data
        })

        this.props.onStateChange("active");
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidUpdate(preProps) {
    const { feedname, main } = this.props;
    if (feedname !== preProps.feedname) {
      this.setState({
        data: [],
        paged: 1
      });

      if (main) {
        this.props.onStateChange("no-active");
        this.setState({ pending: true })
        axios.post('/api/feeds/all.rss')
          .then(({ data: { data: feedData } }) => {
            let { data } = this.state;
            data = [...data, ...feedData];
            this.setState({
              pending: false,
              data
            })

            this.props.onStateChange("active");
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        try {
          this.setState({
            pending: true,
          })
          axios.post('/api/feeds', { name: feedname })
            .then(({ data: { data: feedData } }) => {
              let { data } = this.state;
              data = [...data, ...feedData];
              this.setState({
                pending: false,
                data
              })
              this.props.onStateChange("active");
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  render() {
    this.state.data.sort(this.compare);

    return (
      <div className="feed-area-image" id="feed-area-image" onScroll={this.trackScrolling}>
        {this.state.pending ? (
          <div className="image-area">
            <img src="logos/loading-gif1.gif" alt="" />
          </div>
        ) : (
            <div className="row">
              {this.state.data && this.state.data.map((feed) => {
                return (
                  <div className="col-lg-4 col-md-6 col-xs-12 mb-4 feed-area">
                    <FeedArea
                      feedContent={feed}
                    />
                  </div>
                )
              })}
            </div>
          )}
      </div>
    )
  }
}

FeedWidget.propTypes = {
  urlList: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  urlList: state.feed
});

export default connect(mapStateToProps)(FeedWidget);
