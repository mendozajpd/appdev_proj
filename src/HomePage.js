const title = "This is my title";
const fb = "https://facebook.com";
const yt = "https://youtube.com";

const HomePage = () => {
  return (
    <div className="content">
      <h1>{title}</h1>
      <div className="anchors">
        <a href={fb}>Facebook</a>
      </div>
      <div className="anchors">
        <a href={yt}>Youtube</a>
      </div>
    </div>
  );
};

export default HomePage;
