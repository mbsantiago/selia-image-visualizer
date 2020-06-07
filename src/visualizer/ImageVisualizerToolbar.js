import React from 'react';


const activeButtonClass = 'btn btn-primary m-1';
const buttonClass = 'btn btn-light m-1';
const MOVING = 'moving';
const ZOOMING = 'zooming';


class ImageVisualizerToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      state: props.state,
    };
  }

  handleMove() {
    const { activator, setState } = this.props;

    activator();
    setState(MOVING);
    this.setState({
      active: true,
      state: MOVING,
    });
  }

  handleZoomRect() {
    const { activator, setState } = this.props;

    activator();
    setState(ZOOMING);

    this.setState({
      active: true,
      state: ZOOMING,
    });
  }

  renderZoomRectButton() {
    let className = buttonClass;
    const { active, state } = this.state;
    if (active && state === ZOOMING) {
      className = activeButtonClass;
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
    const { active, state } = this.state;
    if (active && state === MOVING) {
      className = activeButtonClass;
    }

    return (
      <button
        type="button"
        className={className}
        onClick={() => this.handleMove()}
      >
        <i className="fas fa-arrows-alt" />
      </button>
    );
  }

  renderHomeButton() {
    const { home } = this.props;

    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => home()}
      >
        <i className="fas fa-home" />
      </button>
    );
  }

  renderZoomPlusButton() {
    const { zoom } = this.props;

    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => zoom(2)}
      >
        <i className="fas fa-search-plus" />
      </button>
    );
  }

  renderZoomMinusButton() {
    const { zoom } = this.props;

    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => zoom(-2)}
      >
        <i className="fas fa-search-minus" />
      </button>
    );
  }

  renderBackButton() {
    const { restoreState } = this.props;

    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => restoreState()}
      >
        <i className="fas fa-undo" />
      </button>
    );
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
}


export default ImageVisualizerToolbar;
