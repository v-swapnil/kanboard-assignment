function Avatar({ userName, userIsAvailable }) {
  return (
    <div className="user-img-with-status" title={userName}>
      <img
        src={"https://picsum.photos/200?" + userName}
        alt="user-img"
        className="user-img"
      />
      <span
        className={
          "user-status " + (userIsAvailable ? "available" : "not-available")
        }
      />
    </div>
  );
}

export default Avatar;
