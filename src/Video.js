import './Video.css';
import React from "react";

const Video = React.forwardRef((props, ref) => {
  return (
    <div
      className={'video' + (props.isPlaying ? ' playing' : ' paused')}
      onClick={props.onClick}
      data-id={props.dataId}
      ref={ref}
    >
    </div>
  )
});

export default Video;