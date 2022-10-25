const ConnectButton = ({ connected, connectFn }) => {
  if (connected) {
    return (
      <button className="btn btn-primary connect-btn" disabled>
        Connected
      </button>
    );
  }

  return <button className="connect-btn" onClick={connectFn}>Connect</button>;
};

export default ConnectButton;
