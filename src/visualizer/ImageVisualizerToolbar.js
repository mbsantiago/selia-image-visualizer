import React from 'react';


class ImageVisualizerToolbar extends React.Component {
  handleZoomRect() {
    const { activator, setState, states } = this.props;
    activator();
    setState(states.ZOOMING);
  }

  renderZoomRectButton() {
    let className = this.props.styles.button.default;
    const { active, state, states } = this.props;
    if (active && state === states.ZOOMING) {
      className = this.props.styles.button.active;
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

  renderZoomPlusButton() {
    const { zoom } = this.props;
    let className = this.props.styles.button.default

    return (
      <button
        type="button"
        className={className}
        onClick={() => zoom(2)}
      >
        <i className="fas fa-search-plus" />
      </button>
    );
  }

  renderZoomMinusButton() {
    const { zoom } = this.props;
    let className = this.props.styles.button.default

    return (
      <button
        type="button"
        className={className}
        onClick={() => zoom(-2)}
      >
        <i className="fas fa-search-minus" />
      </button>
    );
  }

  render() {
    const { moveButton, homeButton, restoreButton } = this.props;

    return (
      <div className="col p-2">
        {moveButton()}
        {homeButton()}
        {restoreButton()}
        {this.renderZoomRectButton()}
        {this.renderZoomPlusButton()}
        {this.renderZoomMinusButton()}
      </div>
    );
  }
}


export default ImageVisualizerToolbar;
