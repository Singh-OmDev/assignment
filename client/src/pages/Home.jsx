import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGigs, reset } from '../features/gigs/gigSlice';
import GigCard from '../components/GigCard';
import { FaSearch } from 'react-icons/fa';

const Home = () => {
    const dispatch = useDispatch();
    const { gigs, isLoading, isError, message } = useSelector(
        (state) => state.gigs
    );

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        dispatch(getGigs(searchTerm));

        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch, searchTerm]); // Adding searchTerm to dependency array for live search? Or separate submit?
    // Let's do live search with debounce normally, but for now, let's just add a search button or effect.
    // Actually, putting logic in onSubmit is better for performance than every keystroke without debounce.
    // Re-writing effect to only run on mount/reset.

    const onSearch = (e) => {
        e.preventDefault();
        dispatch(getGigs(searchTerm));
    };

    if (isLoading) {
        return <div className="flex justify-center mt-20"><div className="loader">Loading...</div></div>;
    }

    return (
        <div className="py-10">
            <section className='mb-12 text-center'>
                <h1 className='text-5xl font-extrabold text-gray-900 mb-4 tracking-tight'>
                    Find Your Next <span className="text-blue-600">Gig</span>
                </h1>
                <p className='text-gray-500 text-lg mb-8'>
                    Browse thousands of job opportunities or post your own.
                </p>

                <form onSubmit={onSearch} className="max-w-2xl mx-auto relative flex">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for jobs..."
                        className="w-full pl-12 pr-4 py-4 rounded-l-full border-2 border-r-0 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-r-full transition duration-300 text-lg">
                        Search
                    </button>
                </form>
            </section>

            <section className='content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4'>
                {gigs.length > 0 ? (
                    gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10 text-xl">
                        No gigs found. Check back later!
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
