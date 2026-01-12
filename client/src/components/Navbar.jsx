import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className='bg-white shadow-md'>
            <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
                <div className='logo'>
                    <Link to='/' className='text-2xl font-bold text-blue-600 hover:text-blue-800 transition'>
                        GigFlow
                    </Link>
                </div>
                <nav className='flex items-center space-x-6'>
                    <Link to='/' className='text-gray-600 hover:text-blue-600 transition font-medium'>
                        Find Work
                    </Link>
                    {user ? (
                        <>
                            <Link to='/create-gig' className='text-gray-600 hover:text-blue-600 transition font-medium'>
                                Post a Gig
                            </Link>
                            <div className='flex items-center space-x-4 ml-4 border-l pl-4 border-gray-200'>
                                <span className='text-gray-800 font-semibold flex items-center gap-2'>
                                    <FaUser className="text-gray-400" /> {user.name}
                                </span>
                                <button
                                    className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm'
                                    onClick={onLogout}
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='flex items-center space-x-4 ml-4'>
                            <Link
                                to='/login'
                                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium'
                            >
                                <FaSignInAlt /> Login
                            </Link>
                            <Link
                                to='/register'
                                className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow-md flex items-center gap-2'
                            >
                                <FaUser /> Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
