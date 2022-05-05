import './App.css';
import Video from './Video';
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: props.allVideos.map((vid) => ({
        id: vid.id,
        isVisible: false,
        isPlaying: false,
        ref: React.createRef(),
      })),
      currentPlaying: null,
    };
  }

  componentDidMount() {
    //Play after mount
    this.setState(state => {
      const currentPlaying = 0;

      const videos = state.videos.slice();
      videos[currentPlaying].isPlaying = true;

      return {
        currentPlaying: currentPlaying,
        videos: videos,
      }
    });

    const observer = new IntersectionObserver((entries, observer) => {
        console.log(entries);

        const videos = this.state.videos.slice();
        let currentPlaying = this.state.currentPlaying;


        entries.forEach((item, index) => {
          const id = Number(item.target.dataset.id);
          videos[id].isVisible = item.isIntersecting;
        });

        // Play first top video and stop previous
        for(const [i, vid] of videos.entries()) {
          if (videos[currentPlaying].isVisible && !videos[currentPlaying - 1]?.isVisible) break;
          if (vid.isVisible) {
            console.log('play next')
            videos[currentPlaying].isPlaying = false;
            currentPlaying = i;
            vid.isPlaying = true;
            break;
          }
        }

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

    // const elements = document.querySelectorAll('.video');
    const elements = this.state.videos.map( vid => vid.ref.current );
    elements.forEach(element => observer.observe(element));
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
    // const videosToRender = this.state.allVideos.slice();

    // this.setState({ videos: videosToRender });

    const videos = this.state.videos.map((video, index) =>
      <Video
        key={index.toString()}
        isPlaying={video.isPlaying}
        onClick={() => this.handleClick(index)}
        dataId={index}
        ref={video.ref}
      />
    )

    return (
      <div className="App">
        { videos }
      </div>
    )
  }
}

export default App;
