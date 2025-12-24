import React from 'react'
import { Link } from 'react-router'

function Navbar() {
    return (
        <div>
            <nav
                className="navbar navbar-expand-lg shadow-sm py-2"
                style={{ backgroundColor: '#7dd3fc' }}
            >
                <div className="container-fluid px-4">

                    {/* Brand */}
                    <Link
                        className="navbar-brand fw-bold d-flex align-items-center"
                        style={{ color: '#0c4a6e' }}
                        to="/home"
                    >
                        <span
                            className="me-2 rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32 }}
                        >
                            S
                        </span>
                        Sunbeam Online Course Portal
                    </Link>

                    {/* Toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">

                        {/* Menu */}
                        <ul className="navbar-nav ms-4">
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="#">About Sunbeam</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="#">Courses</Link>
                            </li>
                        </ul>

                        {/* Search */}
                        <form className="d-flex ms-4">
                            <input
                                className="form-control form-control-sm me-2"
                                type="search"
                                placeholder="Search courses"
                                style={{ width: 220 }}
                            />
                            <button className="btn btn-outline-dark btn-sm">
                                Search
                            </button>
                        </form>

                        {/* Login */}
                        <div className="ms-auto">
                            <Link className="btn btn-outline-light btn-sm fw-semibold" to="/login">
                                Login
                            </Link>
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
