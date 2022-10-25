const ConnectButton = ({ connected, connectFn }) => {
  if (connected) {
    return (
      <button className="btn btn-primary" disabled>
        Connected
      </button>
    );
  }

  return <button className="connect-btn" onClick={connectFn}>Connect</button>;
};

export default ConnectButton;
