import cows from "../assets/Cows.jpg";
import flowers from "../assets/Flowers.jpg";
import shadow from "../assets/Shadow.jpg";
import mountain from "../assets/Mountains.jpg";
import "../stylesheets/Homepage.css";

export default function Homepage() {
  return (
    <div className="homepage">
      <h1>Welcome to Nahebook</h1>
      <div className="images">
        <img src={cows} alt="" />
        <img src={mountain} alt="" />
        <img src={flowers} alt="" />
        <img src={shadow} alt="" />
      </div>
    </div>
  );
}
