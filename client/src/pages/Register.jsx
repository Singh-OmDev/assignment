import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { FaUser } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };
            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <div className="flex justify-center mt-20"><div className="loader">Loading...</div></div>;
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                <section className='heading text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-3'>
                        <FaUser className="text-blue-600" /> Register
                    </h1>
                    <p className='text-gray-500'>Create an account to join the marketplace</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <input
                                type='text'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='name'
                                name='name'
                                value={name}
                                placeholder='Enter your name'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type='email'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Enter your email'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type='password'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='password'
                                name='password'
                                value={password}
                                placeholder='Enter password'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type='password'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='confirmPassword'
                                name='confirmPassword'
                                value={confirmPassword}
                                placeholder='Confirm password'
                                onChange={onChange}
                                required
                            />
                        </div>

                        <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md transform hover:-translate-y-1'>
                            Submit
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Register;
