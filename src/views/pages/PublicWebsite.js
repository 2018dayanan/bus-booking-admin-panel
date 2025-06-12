import React from 'react'
import { Link } from 'react-router-dom'

const PublicWebsite = () => {
  return (
    <div className="public-website">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <strong>Sumagar</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-light btn-sm ms-2" to="/admin/login">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to <span className="text-primary">Sumagar</span>
              </h1>
              <p className="lead mb-4">
                Your trusted partner for innovative solutions and exceptional service. 
                We help businesses grow and succeed in the digital age.
              </p>
              <div className="d-flex gap-3">
                <a href="#services" className="btn btn-primary btn-lg">
                  Our Services
                </a>
                <a href="#contact" className="btn btn-outline-primary btn-lg">
                  Get Started
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '300px', height: '300px' }}>
                  <i className="fas fa-rocket text-white" style={{ fontSize: '4rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="mb-4">About Sumagar</h2>
              <p className="lead mb-5">
                We are a leading technology company dedicated to providing cutting-edge solutions 
                for businesses of all sizes. Our team of experts is committed to delivering 
                exceptional results that drive growth and success.
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-lightbulb text-white"></i>
                  </div>
                  <h5 className="card-title">Innovation</h5>
                  <p className="card-text">
                    We stay ahead of the curve with the latest technologies and innovative approaches.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-users text-white"></i>
                  </div>
                  <h5 className="card-title">Expert Team</h5>
                  <p className="card-text">
                    Our experienced professionals are dedicated to delivering excellence in every project.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <h5 className="card-title">24/7 Support</h5>
                  <p className="card-text">
                    Round-the-clock support to ensure your business runs smoothly at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="mb-4">Our Services</h2>
              <p className="lead mb-5">
                We offer a comprehensive range of services to help your business thrive in the digital landscape.
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="card-title text-primary">Web Development</h5>
                  <p className="card-text">
                    Custom websites and web applications built with modern technologies and best practices.
                  </p>
                  <ul className="list-unstyled">
                    <li>✓ Responsive Design</li>
                    <li>✓ SEO Optimization</li>
                    <li>✓ Performance Focused</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="card-title text-primary">Mobile Apps</h5>
                  <p className="card-text">
                    Native and cross-platform mobile applications for iOS and Android platforms.
                  </p>
                  <ul className="list-unstyled">
                    <li>✓ Native Development</li>
                    <li>✓ Cross-Platform</li>
                    <li>✓ App Store Optimization</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="card-title text-primary">Cloud Solutions</h5>
                  <p className="card-text">
                    Scalable cloud infrastructure and migration services for modern businesses.
                  </p>
                  <ul className="list-unstyled">
                    <li>✓ AWS/Azure/GCP</li>
                    <li>✓ Migration Services</li>
                    <li>✓ Cost Optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="mb-4">Get In Touch</h2>
              <p className="lead mb-5">
                Ready to start your next project? Contact us today for a free consultation.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <form>
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Your Name" />
                    </div>
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Your Email" />
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="5" placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Sumagar</h5>
              <p className="mb-0">Empowering businesses with innovative technology solutions.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                © 2024 Sumagar. All rights reserved. | 
                <Link to="/admin/login" className="text-white ms-2">Admin</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicWebsite 