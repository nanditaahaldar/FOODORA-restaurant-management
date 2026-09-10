import { Link } from "react-router-dom";
import heroFood from "../assets/foodora-hero.webp";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <img
          src={heroFood}
          alt="Delicious food"
          className="hero-background"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-subtitle">WELCOME TO FOODORA</p>

          <h1>
            Delicious Food,
            <br />
            <span>Made For You</span>
          </h1>

          <p className="hero-description">
            Enjoy delicious meals made with fresh ingredients
            and served with love.
          </p>

          <Link to="/menu" className="hero-button">
            Explore Our Menu
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <p className="section-subtitle">WHY FOODORA?</p>

        <h2>Good Food. Good Mood.</h2>

        <p className="about-text">
          At Foodora, we believe that great food brings people together.
          Explore our menu and discover delicious dishes prepared especially
          for you.
        </p>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Delicious Food</h3>
            <p>
              Carefully prepared dishes made with quality ingredients.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Fresh Ingredients</h3>
            <p>
              We use fresh ingredients to give you the best taste.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Made With Love</h3>
            <p>
              Every dish is prepared with care and passion.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="menu-cta">
        <h2>Hungry Already?</h2>

        <p>
          Discover something delicious from our menu.
        </p>

        <Link to="/menu" className="cta-button">
          View Menu
        </Link>
      </section>
    </div>
  );
}

export default Home;