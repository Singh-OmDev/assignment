import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
    return (
        <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full'>
            <div className="flex-grow">
                <div className='flex justify-between items-start mb-4'>
                    <h3 className='text-xl font-bold text-gray-800 line-clamp-2'>{gig.title}</h3>
                    <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap'>
                        ${gig.budget}
                    </span>
                </div>
                <p className='text-gray-600 mb-4 line-clamp-3 leading-relaxed'>
                    {gig.description}
                </p>
                <div className="mb-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${gig.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {gig.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <Link
                to={`/gigs/${gig._id}`}
                className='block w-full text-center bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-2 px-4 rounded-lg transition duration-200 border border-blue-600 hover:border-transparent'
            >
                View Details
            </Link>
        </div>
    );
};

export default GigCard;
