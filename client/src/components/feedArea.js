import React from 'react';
import BookMark from '@material-ui/icons/BookmarkBorder';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

import moment from 'moment';
import 'moment-precise-range-plugin';

import './feedWidget.css'

function formartDate(str) {
  const dateStr1 = str.split('T')[0];
  const dateStr2 = str.split('T')[1].split('.')[0];

  return dateStr1 + ' ' + dateStr2;
}

function calDiffDate(date) {
  if (!date) {
    return '';
  }

  const today = new Date();
  const startDate = formartDate(today.toISOString());
  const endDate = formartDate(date);

  const currentDate = moment.preciseDiff(moment(startDate, 'YYYY-MM-DD HH:mm:ss'), moment(endDate, 'YYYY-MM-DD HH:mm:ss'), true);

  if (currentDate.years > 0) {
    return ' | ' + currentDate.years + 'y';
  }

  if (currentDate.months > 0) {
    return ' | ' + currentDate.months + 'M';
  }

  if (currentDate.days > 0) {
    return ' | ' + currentDate.days + 'd';
  }

  if (currentDate.hours > 0) {
    return ' | ' + currentDate.hours + 'h';
  }

  if (currentDate.minutes > 0) {
    return ' | ' + currentDate.minutes + 'm';
  }

  return ' | 1m';
}


function FeedArea(
  feedContent,
) {
  const feedDate = calDiffDate(feedContent.feedContent.date);

  const oncli = () => {
    window.open(feedContent.feedContent.url);
  }

  return (
    <div className="card" onClick={oncli}>
      <div className="title">
        <p>{feedContent.feedContent.title}</p>
      </div>
      <div className="source">
        {feedContent.feedContent.publisher === "CannabisNet" ? (
          <p>Cananbis.net {feedDate}</p>
        ) : (
            <p>{feedContent.feedContent.publisher} {feedDate}</p>
          )}
      </div>
      <div className="image-div">
        <img src={feedContent.feedContent.image} className="image" alt="" />
      </div>
      <div className="description">
        <p>{feedContent.feedContent.description}</p>
      </div>
      <div className="action">
        <OpenInBrowser className="mr-4" />
        <BookMark />
      </div>
    </div>
  );
}

export default FeedArea;
