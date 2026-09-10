import { Link } from "react-router-dom";

import heroFood from "../assets/FoodAura-hero.webp";
import { getUserRole, isLoggedIn } from "../services/auth";

function Home() {
  const loggedIn = isLoggedIn();
  const role = getUserRole();

  const isAdmin = loggedIn && role === "admin";

  return (
    <div className="home">

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="hero">

        <img
          src={heroFood}
          alt="Delicious food"
          className="hero-background"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="hero-subtitle">
            {isAdmin ? "WELCOME TO FoodAura ADMIN" : "WELCOME TO FoodAura"}
          </p>

          <h1>
            {isAdmin ? (
              <>
                Manage FoodAura,
                <br />
                <span>Manage With Ease</span>
              </>
            ) : (
              <>
                Delicious Food,
                <br />
                <span>Made For You</span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {isAdmin
              ? "Manage your restaurant, menu, orders and users from one place."
              : "Enjoy delicious meals made with fresh ingredients and served with love."}
          </p>

          {/* USER HERO BUTTON */}

          {!isAdmin && (
            <Link to="/menu" className="hero-button">
              Explore Our Menu
            </Link>
          )}

          {/* ADMIN HERO BUTTON */}

          {isAdmin && (
            <Link to="/admin/dashboard" className="hero-button">
              Go to Dashboard
            </Link>
          )}

        </div>
      </section>


      {/* ==================================================
          ABOUT / ADMIN SECTION
      ================================================== */}

      {!isAdmin ? (
        /* ==================================================
           USER HOME
        ================================================== */

        <section className="about">

          <p className="section-subtitle">
            WHY FoodAura?
          </p>

          <h2>
            Good Food. Better Mood.
          </h2>

          <p className="about-text">
            At FoodAura, we believe that great food brings people together.
            Explore our menu and discover delicious dishes prepared especially
            for you.
          </p>

          <div className="features">

            <div className="feature-card">
              <div className="feature-icon">
                🍽️
              </div>

              <h3>
                Delicious Food
              </h3>

              <p>
                Carefully prepared dishes made with quality ingredients.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">
                🥗
              </div>

              <h3>
                Fresh Ingredients
              </h3>

              <p>
                We use fresh ingredients to give you the best taste.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">
                ❤️
              </div>

              <h3>
                Made With Love
              </h3>

              <p>
                Every dish is prepared with care and passion.
              </p>
            </div>

          </div>

        </section>

      ) : (

        /* ==================================================
           ADMIN HOME
        ================================================== */

        <section className="about">

          <p className="section-subtitle">
            FoodAura MANAGEMENT
          </p>

          <h2>
            Manage Your Restaurant
          </h2>

          <p className="about-text">
            Welcome to the FoodAura admin panel. Manage your menu, monitor
            orders, view users and keep your restaurant running smoothly.
          </p>

          <div className="features">

            {/* DASHBOARD */}

            <div className="feature-card">

              <div className="feature-icon">
                📊
              </div>

              <h3>
                Dashboard
              </h3>

              <p>
                View restaurant statistics and important information.
              </p>

              <Link
                to="/admin/dashboard"
                className="cta-button"
              >
                View Dashboard
              </Link>

            </div>


            {/* MENU MANAGEMENT */}

            <div className="feature-card">

              <div className="feature-icon">
                🍽️
              </div>

              <h3>
                Menu Management
              </h3>

              <p>
                Add, update, delete and manage your restaurant menu.
              </p>

              <Link
                to="/admin/menu"
                className="cta-button"
              >
                Manage Menu
              </Link>

            </div>


            {/* ORDERS */}

            <div className="feature-card">

              <div className="feature-icon">
                📦
              </div>

              <h3>
                Order Management
              </h3>

              <p>
                View customer orders and manage their order status.
              </p>

              <Link
                to="/admin/orders"
                className="cta-button"
              >
                View Orders
              </Link>

            </div>

          </div>

        </section>

      )}


      {/* ==================================================
          CTA SECTION
      ================================================== */}

      <section className="menu-cta">

        {isAdmin ? (
          <>
            <h2>
              Ready to Manage FoodAura?
            </h2>

            <p>
              Keep your restaurant organized and provide a great experience
              for your customers.
            </p>

            <Link
              to="/admin/menu"
              className="cta-button"
            >
              Manage Menu
            </Link>
          </>
        ) : (
          <>
            <h2>
              Hungry Already?
            </h2>

            <p>
              Discover something delicious from our menu.
            </p>

            <Link
              to="/menu"
              className="cta-button"
            >
              View Menu
            </Link>
          </>
        )}

      </section>

    </div>
  );
}

export default Home;