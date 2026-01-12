import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getGig, reset as resetGig } from '../features/gigs/gigSlice';
import { getBids, placeBid, hireFreelancer, reset as resetBid } from '../features/bids/bidSlice'; // Assuming resetBid wraps reset from bidSlice
import { FaMoneyBillWave, FaUserCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const GigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentGig, isLoading: isGigLoading, isError: isGigError, message: gigMessage } = useSelector((state) => state.gigs);
    const { user } = useSelector((state) => state.auth);
    const { bids, isLoading: isBidLoading, isSuccess: isBidSuccess, message: bidMessage } = useSelector((state) => state.bids);

    const [bidMessageInput, setBidMessageInput] = useState('');
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        if (isGigError) {
            toast.error(gigMessage);
        }
        dispatch(getGig(id));

        return () => {
            dispatch(resetGig());
        };
    }, [isGigError, gigMessage, dispatch, id]);

    useEffect(() => {
        if (user && currentGig && user._id === currentGig.ownerId._id) {
            dispatch(getBids(id));
        }
    }, [user, currentGig, dispatch, id]);

    // Effect to handle Bid Placement success
    useEffect(() => {
        if (isBidSuccess && bidMessageInput) { // lazy check if we just submitted
            // actually isBidSuccess might be true from getBids too.
            // Ideally we should have separate states or flags, but for now simple toast if message is empty (from placeBid payload) or generic
            // Resetting forms
            setBidMessageInput('');
            setBidAmount('');
            // We can't easily distinguish getBids success vs placeBid success with single slice state without extra flags.
            // But placeBid adds to bids? No, implemented placeBid doesn't push to state.bids in slice.

        }
    }, [isBidSuccess]);


    const onPlaceBid = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(placeBid({ gigId: id, message: bidMessageInput, amount: bidAmount }))
            .unwrap()
            .then(() => {
                toast.success('Bid placed successfully!');
                setBidMessageInput('');
                setBidAmount('');
            })
            .catch(toast.error);
    };

    const onHire = (bidId) => {
        dispatch(hireFreelancer(bidId))
            .unwrap()
            .then(() => {
                toast.success('Freelancer hired!');
                // refetch gig to update status
                dispatch(getGig(id));
            })
            .catch(toast.error);
    };

    if (isGigLoading || !currentGig) {
        return <div className="flex justify-center mt-20"><div className="loader">Loading...</div></div>;
    }

    const isOwner = user && user._id === currentGig.ownerId._id;
    const isAssigned = currentGig.status === 'assigned';

    return (
        <div className="py-10">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{currentGig.title}</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            Posted by <span className="font-semibold text-gray-700 flex items-center gap-1"><FaUserCircle /> {currentGig.ownerId.name}</span>
                            <span>•</span>
                            <span>{new Date(currentGig.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-green-600 mb-1">${currentGig.budget}</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${isAssigned ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'}`}>
                            {currentGig.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8 border-t pt-6 border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Project Description</h3>
                    <p className="whitespace-pre-line leading-relaxed">{currentGig.description}</p>
                </div>

                {!isOwner && !isAssigned && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Place specific Bid</h3>
                        <form onSubmit={onPlaceBid} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Why should we hire you?"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={bidMessageInput}
                                        onChange={(e) => setBidMessageInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md w-full sm:w-auto">
                                Send Bid
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Bids Section for Owner */}
            {isOwner && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Received Bids ({bids.length})</h2>
                    {isBidLoading ? (
                        <div>Loading bids...</div>
                    ) : bids.length === 0 ? (
                        <p className="text-gray-500">No bids yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {bids.map((bid) => (
                                <div key={bid._id} className={`bg-white rounded-lg shadow-sm border p-6 flex justify-between items-center transition ${bid.status === 'hired' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800">{bid.freelancerId.name}</span>
                                            <span className="text-gray-400 text-sm">({bid.freelancerId.email})</span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{bid.message}</p>
                                        <div className="font-bold text-green-700">${bid.amount}</div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        {bid.status === 'pending' && !isAssigned ? (
                                            <button
                                                onClick={() => onHire(bid._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition transform hover:scale-105"
                                            >
                                                Hire
                                            </button>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1
                                                ${bid.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {bid.status === 'hired' ? <><FaCheckCircle /> HIRED</> : <><FaTimesCircle /> {bid.status.toUpperCase()}</>}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GigDetails;
