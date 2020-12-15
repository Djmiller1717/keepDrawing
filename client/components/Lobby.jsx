import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: { name: props.name },
    };
    this.save = this.save.bind(this);
  }

  save(ev) {
    ev.preventDefault();
    const { changeName, handleStatusChange, isVideo } = this.props;
    const { name } = this.state.player;
    if (name && isVideo) {
      changeName(name);
      handleStatusChange('waiting room', name);
    }
  }

  render() {
    const { name } = this.state;
    const { message } = this.props;
    return (
      <div>
        <h1>Keep Drawing!</h1>
        <div className="lobby-div">
          <form className="lobby-form" onSubmit={this.save}>
            <label htmlFor="username" className="lobby-label">Enter name:
              <input
                name="username"
                className="lobby-input"
                placeholder="Nickname"
                value={name}
                onChange={(ev) => {
                  this.setState({
                    player: { name: ev.target.value },
                  });
                }}
              />
            </label>
            <button type="submit" className="lobby-button"> Play </button>
            <p className ='lobby-status'>{message}</p>
          </form>
        </div>
      </div>
    );
  }
}

export default Lobby;
