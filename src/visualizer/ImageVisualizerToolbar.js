import React from 'react';


const activeButtonClass = 'btn btn-primary m-1';
const buttonClass = 'btn btn-light m-1';
const MOVING = 'moving';
const ZOOMING = 'zooming';


class ImageVisualizerToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.activate,
      state: props.state,
    };
  }

  render() {
    return (
      <div className="col p-2">
        {this.renderMoveButton()}
        {this.renderZoomRectButton()}
        {this.renderHomeButton()}
        {this.renderZoomPlusButton()}
        {this.renderZoomMinusButton()}
        {this.renderBackButton()}
      </div>
    );
  }

  renderZoomRectButton() {
    let className = buttonClass;
    if (this.props.active && this.state.state == ZOOMING) {
      className = activeButtonClass
    }

    return (
      <button
        type="button"
        className={className}
        onClick={() => this.handleZoomRect()}
      >
        <i className="fas fa-expand" />
      </button>
    );
  }

  renderMoveButton() {
    let className = buttonClass;
    if (this.props.active && this.state.state == MOVING) {
      className = activeButtonClass
    }

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
        className={buttonClass}
        onClick={() => this.props.home()}
      >
        <i className="fas fa-home"></i>
      </button>
    );
  }

  renderZoomPlusButton() {
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => this.props.zoom(2)}
      >
        <i className="fas fa-search-plus"></i>
      </button>
    );
  }

  renderZoomMinusButton() {
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => this.props.zoom(-2)}
      >
        <i className="fas fa-search-minus" />
      </button>
    );
  }

  renderBackButton() {
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => this.props.restoreState()}
      >
        <i className="fas fa-undo" />
      </button>
    );
  }

  handleMove() {
    this.props.activator();
    this.props.setState(MOVING);
    this.setState({
      active: true,
      state: MOVING,
    });
  }

  handleZoomRect() {
    this.props.activator();
    this.props.setState(ZOOMING);
    this.setState({
      active: true,
      state: ZOOMING,
    });
  }
}


export default ImageVisualizerToolbar;
