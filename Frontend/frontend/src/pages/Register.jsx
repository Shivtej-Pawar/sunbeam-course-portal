import React, { useState } from 'react'
import { Link, useNavigate ,useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { registerToCourse } from '../services/courseServices'
import './Register.css'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const navigate = useNavigate()
    const location=useLocation()
    const {courseId,courseName}=location.state || {}

    const register = async () => {
        if (name === '')
            toast.warn('name must be entered')
        else if (email === '')
            toast.warn('email must be entered')
        else if (mobile === '')
            toast.warn('mobile must be entered')
        else {
            const result = await registerToCourse(name, email, courseId, mobile)
            if (result.status === 'success') {
                toast.success('user registered successfully')
                navigate('/')
            } else {
                toast.error(result.error)
            }
        }
    }

    return (
        <div className="register-page d-flex justify-content-center align-items-center">
            <div className="register-card shadow-sm">

                <h3 className="text-center mb-4">Register</h3>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>            

                <div className="mb-3">
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Mobile"
                        onChange={e => setMobile(e.target.value)}
                    />
                </div>
                
                
                <div className="mb-3">
                    <label className="form-label">Course</label>
                    <input
                        type="text"
                        className="form-control"
                        value={courseName || ''}
                        disabled
                    />
                  </div>



                <button
                    className="btn btn-info w-100 text-white fw-semibold"
                    onClick={register}
                >
                    Signup
                </button>

                <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/" className="text-info fw-semibold">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Register
