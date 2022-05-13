import './App.css';
import Video from './Video';
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: null,
      currentPlaying: null,
    };
  }

  /**
   *
   * @param id
   * @param amount of items
   */
  getVideos(id, amount) {
    if (id === 0) return this.props.allVideos.slice(id, id + amount);

    if (amount < 0) {
      for (const [index, vid] of this.props.allVideos.entries()) {
        if (vid.id === id) return this.props.allVideos[index + amount];
      }
    }

    for (const [index, vid] of this.props.allVideos.entries()) {
      if (vid.id === id) return this.props.allVideos[index + 1];
    }
  }

  getVideo(videos, id) {
    for (const vid of videos) {
      if (vid.id === id) return vid;
    }
  }

  getNextToPlay(videos, currentPlaying) {
    for (const [index, vid] of videos.entries()) {
      if (vid.id === currentPlaying) return videos[index + 1].id;
    }
  }

  getPrevToPlay(videos, currentPlaying) {
    for (const [index, vid] of videos.entries()) {
      if (vid.id === currentPlaying) return videos[index - 1].id;
    }
  }

  componentDidMount() {
    // get first [DOMElementsMaxNum]:number videos
    const videos = this.getVideos(0, Math.floor(this.props.DOMElementsMaxNum / 2) + 1)
      .map(vid => ({
          id: vid.id,
          isVisible: false,
          isPlaying: false,
          ref: React.createRef(),
      }));

    //Play first video
    const currentPlaying = videos[0].id;
    // videos[currentPlaying].isPlaying = true;
    this.getVideo(videos, currentPlaying).isPlaying = true;
    this.setState({
      videos: videos,
      currentPlaying: currentPlaying,
    });

    const observer = new IntersectionObserver((entries, observer) => {
        console.log(entries);

        const videos = this.state.videos.slice();
        let currentPlaying = this.state.currentPlaying;


        entries.forEach((item, index) => {
          const id = Number(item.target.dataset.id);
          this.getVideo(videos, id).isVisible = item.isIntersecting;
        });

        if (!this.getVideo(videos, currentPlaying).isVisible) {
          this.getVideo(videos, currentPlaying).isPlaying = false;

          if (this.getVideo(videos, currentPlaying + 1).isVisible) {
            if (this.getVideo(videos, currentPlaying - 1)) observer.unobserve(this.getVideo(videos, currentPlaying - 1)?.ref.current);
            currentPlaying = this.getNextToPlay(videos, currentPlaying);
            this.getVideo(videos, currentPlaying).isPlaying = true;
            observer.observe(this.getVideo(videos, currentPlaying + 1).ref.current);
            // delete video from the top
            if (videos.length > this.props.DOMElementsMaxNum)
              videos.shift();
            // add video to the bottom
            const lastId = videos[videos.length - 1].id;
            videos.push({
              id: this.getVideos(lastId, 1).id,
              isVisible: false,
              isPlaying: false,
              ref: React.createRef(),
            });
          }
        }

        if (this.getVideo(videos, currentPlaying - 1)?.isVisible) {
          this.getVideo(videos, currentPlaying).isPlaying = false;
          observer.unobserve(this.getVideo(videos, currentPlaying + 1).ref.current);
          currentPlaying = this.getPrevToPlay(videos, currentPlaying);
          this.getVideo(videos, currentPlaying).isPlaying = true;
          if (this.getVideo(videos, currentPlaying - 1)) observer.observe(this.getVideo(videos, currentPlaying - 1).ref.current);
          // if (videos.length > this.props.DOMElementsMaxNum)
            videos.pop();
          const firstId = videos[0].id;
          if (this.getVideos(firstId, -1)) {
            videos.unshift({
              id: this.getVideos(firstId, -1).id,
              isVisible: false,
              isPlaying: false,
              ref: React.createRef(),
            });
          }
        }

        // Play first top video and stop previous
        // for(const [i, vid] of videos.entries()) {
        //   if (videos[currentPlaying].isVisible && !videos[currentPlaying - 1]?.isVisible) break;
        //   if (vid.isVisible) {
        //     console.log('play next')
        //     videos[currentPlaying].isPlaying = false;
        //     currentPlaying = i;
        //     vid.isPlaying = true;
        //     break;
        //   }
        // }

        this.setState({
          videos: videos,
          currentPlaying: currentPlaying,
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    );

    setTimeout(() => {
      const elementsToObserve = this.state.videos
        .slice(0,2)
        .map( vid => vid.ref.current );

      elementsToObserve.forEach(element => observer.observe(element));
    });

  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log('componentDidUpdate')
  // }
  //
  // componentWillUnmount() {
  //   console.log('componentWillUnmount')
  // }

  // play(i) {
  //   const videos = this.state.videos.slice();
  //   videos[i].isPlaying = true;
  //
  //   this.setState({
  //     videos: videos,
  //   });
  // }

  handleClick(i) {
    const videos = this.state.videos.slice();
    videos[i].isPlaying = !videos[i].isPlaying;

    this.setState({
      videos: videos,
    });
  }

  render() {
    let videos;

    if (this.state.videos) {
      videos = this.state.videos.map((video) =>
        <Video
          key={video.id}
          isPlaying={video.isPlaying}
          onClick={() => this.handleClick(video.id)}
          dataId={video.id}
          ref={video.ref}
        />
      );
    } else {
      videos = 'Loading...';
    }

    return (
      <div className="App">
        { videos }
      </div>
    )
  }
}

export default App;
