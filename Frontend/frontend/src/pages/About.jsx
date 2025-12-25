function About() {
  return (
    <div className="container my-5">

      {/* Hero Section */}
      <div
        className="text-center text-white p-5 rounded shadow"
        style={{
          background: 'linear-gradient(135deg, #0dcaf0, #0d6efd)'
        }}
      >
        <h1 className="fw-bold display-5">About Sunbeam</h1>
        <p className="mt-3 fs-5">
          Empowering students and professionals with industry-ready skills since the late 1990s
        </p>
      </div>

      {/* Intro */}
      <div className="mt-5 text-center">
        <p className="fs-5 text-muted">
          Sunbeam is a trusted name in professional training, known for bridging the gap
          between academic learning and real-world industry requirements.
        </p>
      </div>

      {/* Philosophy */}
      <div className="card mt-4 shadow-sm border-0">
        <div className="card-header bg-info text-white fw-semibold fs-5">
          💡 Our Philosophy
        </div>
        <div className="card-body">
          <p className="mb-0">
            At Sunbeam, we believe that retaining a competitive edge is imperative in today’s
            fast-evolving professional world. As organizations continuously restructure and
            reengineer their processes, individuals must evolve too. We focus on building
            strong fundamentals, practical skills, and the right mindset to help learners
            stay ahead and succeed.
          </p>
        </div>
      </div>

      {/* Expertise, Success, Vision */}
      <div className="row mt-4">

        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">⭐ Our Expertise</h5>
              <p>
                Sunbeam specializes in delivering high-quality technical and professional
                training programs. Our experienced faculty, hands-on approach, and
                industry-aligned curriculum ensure learners gain practical, job-ready skills.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">🏆 Our Success</h5>
              <p>
                Thousands of students and professionals have transformed their careers
                through Sunbeam. Our success is built on innovation, deep industry insight,
                and a strong commitment to learner outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">🚀 Our Vision</h5>
              <p>
                To be a leading center of excellence in education and training by continuously
                evolving with technology, industry demands, and global trends.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Section */}
      <div className="row text-center mt-5">

        <div className="col-md-3 mb-3">
          <div className="p-4 border rounded shadow-sm">
            <h2 className="fw-bold text-primary">25+</h2>
            <p className="mb-0">Years of Excellence</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="p-4 border rounded shadow-sm">
            <h2 className="fw-bold text-primary">50k+</h2>
            <p className="mb-0">Students Trained</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="p-4 border rounded shadow-sm">
            <h2 className="fw-bold text-primary">100+</h2>
            <p className="mb-0">Industry Experts</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="p-4 border rounded shadow-sm">
            <h2 className="fw-bold text-primary">Top</h2>
            <p className="mb-0">Placement Support</p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default About
