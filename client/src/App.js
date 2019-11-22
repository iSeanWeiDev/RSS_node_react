import React, { useState } from 'react';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Fab from '@material-ui/core/Fab';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAlt';

import FeedWidget from './components/feedWidget';

import './App.css';

const FeedConfigList = [
  {
    "index": 1,
    'name': 'merryjane',
    'image': 'logos/merry-jane-logo.png'
  },
  {
    "index": 2,
    'name': 'hightimes',
    'image': 'logos/high-times-logo.png'
  },
  {
    "index": 3,
    'name': 'cannalaw',
    'image': 'logos/canna-law-blog-log.png'
  },
  {
    "index": 4,
    'name': 'leafly',
    'image': 'logos/leafly-logo.png'
  },
  {
    "index": 5,
    'name': 'cannabist2',
    'image': 'logos/cannabis-culture-logo.png'
  },
  {
    "index": 6,
    'name': 'marijuanadaily',
    'image': 'logos/marijuana-daily-logo.png'
  },
  {
    "index": 7,
    'name': 'freshtoast',
    'image': 'logos/fresh-toast-logo.png'
  },
  {
    "index": 8,
    'name': 'medicalmarijuana',
    'image': 'logos/medical-marijuana-logo.png'
  },
  {
    "index": 9,
    'name': 'grizzle',
    'image': 'logos/grizzle-logo.png'
  },
  {
    "index": 10,
    'name': 'cannabisnet',
    'image': 'logos/cannabis-net-log.png'
  },
  {
    "index": 11,
    'name': 'marijuana',
    'image': 'logos/marijuana-com-logo.png'
  },
];

function App(props) {

  const [open, setOpen] = useState(false);
  const [linkActive, setLinkActive] = useState('');
  const [main, setMain] = useState(false);
  const [feedName, setFeedName] = useState(FeedConfigList);
  const [active, setActive] = useState('');
  const [rightBarOpen, setRightBar] = useState('');
  const [contentBarOpen, setContenttBar] = useState('');

  const menuClick = () => {
    setRightBar('rightBarOpen');
    setContenttBar('contentBarOpen');
    console.log('rest');
  }

  const setStateChange = (state) => {
    setLinkActive(state);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const logoClick =() => {
    setMain(true);
    setRightBar('');
    setContenttBar('');
    setActive('all');
    setFeedName('all');
  }

  return (
    <div className="App">
      <div className="topbar desktop">
        <span><img src="logos/top-logo.png" alt="" /></span>
        <span><img src="logos/top-text-logo.png" onClick={logoClick} alt="" /></span>
        <div className="Top-Right-Menu">
          <Fab variant="extended" aria-label="delete" className="mr-4" onClick={handleClickOpen}>
            Get The App
          </Fab>
          <span className="Login-Text" onClick={handleClickOpen}>Login</span>
        </div>
      </div>
      <div className="topbar mobile">
        <span>
          <img src="logos/top-logo.png" alt="" />
        </span>
        <span><img src="logos/top-text-logo.png" alt="" /></span>
        {rightBarOpen !== 'rightBarOpen' ? (
          <span><img src="logos/top-menu-icon.png" onClick={menuClick} alt="" /></span>
        ) : (
            <span onClick={() => { setRightBar(''); setContenttBar(''); }}><img src="logos/close-icon.png" alt="" /></span>
          )}
      </div>
      <div className="content">
        <div className={`sidebar ${rightBarOpen}`}>
          <ul className="navbar-nav mr-auto">
            {
              FeedConfigList.map((feed) => {
                return (
                  <li className={`nav-link ${linkActive}`} key={feed.index} onClick={() => {
                    setRightBar('');
                    setContenttBar('');
                    setActive(feed.name);
                    setFeedName(feed.name);
                    setMain(false);
                  }}>
                    {active === feed.name ? (
                      <ArrowRightIcon />
                    ) : (null)}
                    <img src={feed.image} alt="" />
                  </li>
                )
              })
            }
            {rightBarOpen ? (
              <li className="nav-link" onClick={handleClickOpen}>
                <Fab variant="extended" aria-label="delete">
                  Get The App
                </Fab>
              </li>
            ) : (
                null
              )}
            {rightBarOpen ? (
              <li className="nav-link" onClick={handleClickOpen}>
                <span className="Login-Text">Login</span>
              </li>
            ) : (
                null
              )}
          </ul>
        </div>
        <div className={`mainbar ${contentBarOpen}`} id="mainbar">
          <FeedWidget
            {...props}
            feedname={feedName}
            main={main}
            onStateChange={setStateChange}
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Coming Soon"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}
const mapStateToProps = (state) => ({
  feed: state.feed
});

export default connect(mapStateToProps)(App);