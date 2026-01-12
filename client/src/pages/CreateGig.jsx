import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGig, reset } from '../features/gigs/gigSlice';
import { FaBriefcase } from 'react-icons/fa';

const CreateGig = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
    });

    const { title, description, budget } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.gigs
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success('Gig posted successfully!');
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

        const gigData = {
            title,
            description,
            budget,
        };

        dispatch(createGig(gigData));
    };

    if (isLoading) {
        return <div className="flex justify-center mt-20"><div className="loader">Loading...</div></div>;
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100">
                <section className='heading text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-3'>
                        <FaBriefcase className="text-blue-600" /> Post a Gig
                    </h1>
                    <p className='text-gray-500'>Describe the job and set your budget</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor='title' className='block text-gray-700 font-bold mb-2'>Job Title</label>
                            <input
                                type='text'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='title'
                                name='title'
                                value={title}
                                placeholder='e.g. Build a React Website'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='description' className='block text-gray-700 font-bold mb-2'>Description</label>
                            <textarea
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none h-40 resize-none'
                                id='description'
                                name='description'
                                value={description}
                                placeholder='Describe the requirements in detail...'
                                onChange={onChange}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor='budget' className='block text-gray-700 font-bold mb-2'>Budget ($)</label>
                            <input
                                type='number'
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none'
                                id='budget'
                                name='budget'
                                value={budget}
                                placeholder='e.g. 500'
                                onChange={onChange}
                                required
                            />
                        </div>

                        <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md transform hover:-translate-y-1'>
                            Post Gig
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CreateGig;
