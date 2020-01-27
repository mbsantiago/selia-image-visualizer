import React from 'react';


class ImageVisualizerToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plus: true,
      minus: false
    };
  }

  render() {
    return (
      <div className="col p-2">
        {this.renderMoveButton()}
        {this.renderHomeButton()}
        {this.renderZoomPlusButton()}
        {this.renderZoomMinusButton()}
      </div>
    );
  }

  renderMoveButton() {
    let className = this.props.active ? "btn btn-primary m-1" : "btn btn-light m-1";

    return (
      <button
        type="button"
        className={className}
        onClick={() => this.handleMove()}
      >
        <i className="fas fa-arrows-alt"></i>
      </button>
    );
  }

  renderHomeButton() {
    return (
      <button
        type="button"
        className="btn btn-light m-1"
        onClick={() => this.props.home()}
      >
        <i className="fas fa-home"></i>
      </button>
    );
  }

  renderZoomPlusButton() {
    return(
      <button
        type="button"
        className="btn btn-light m-1"
        onClick={() => this.props.zoom(2)}
      >
        <i className="fas fa-search-plus"></i>
      </button>
    );
  }

  renderZoomMinusButton() {
    return(
      <button
        type="button"
        className="btn btn-light m-1"
        onClick={() => this.props.zoom(-2)}
      >
        <i className="fas fa-search-minus"></i>
      </button>
    );
  }

  handleMove() {
    this.props.activator();
    this.forceUpdate();
  }
}


export default ImageVisualizerToolbar;
