import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper/core';
import {useSelector} from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Link } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';

import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [reserveData, setreserveData] = useState([]);
    const {currentUser} = useSelector((state) => state.user);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();
                if (!res.ok || data.success === false) {
                  throw new Error(data.message || 'Failed to fetch data');
                }
                setListing(data);
                if (currentUser) {
                  const res2 = await fetch(`/api/reservations/getreserve/${currentUser._id}`);
                  const data2 = await res2.json();
                  setreserveData(data2);
                }
            } catch (error) {
                setError(error.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [listingId, reserveData]);
    console.log(reserveData);
    if (loading) {
        return <p className='text-center my-7 text-2xl'>Loading...</p>;
    }

    if (error) {
        return <p className='text-center my-7 text-2xl'>{error}</p>;
    }

return (
  <main>
    {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
    {error && (
      <p className='text-center my-7 text-2xl'>Something went wrong!</p>
    )}
    {listing && !loading && !error && (
      <div>
        <Swiper navigation>
          {listing.imageUrls.map((url, index) => (
            console.log(url),
            <SwiperSlide key={url}>
            <div className='flex justify-center items-center h-[800px] bg-center bg-no-repeat'>
                <img 
                  src={url} 
                  alt={`Slide ${index}`} 
                  className='h-[90%] w-[90%] object-cover rounded-lg shadow-lg' 
                />
            </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
          <FaShare
            className='text-slate-500'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />
        </div>
        {copied && (
          <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
            Link copied!
          </p>
        )}
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          <p className='text-2xl font-semibold'>
            {listing.name} - ${' '}
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
            <FaMapMarkerAlt className='text-green-700' />
            {listing.address}
          </p>
          <div className='flex gap-4'>
            <p className='bg-pink-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
            {listing.offer && (
              <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                ${+listing.regularPrice - +listing.discountPrice}
              </p>
            )}
          </div>
          <p className='text-slate-800'>
            <span className='font-semibold text-black'>Description - </span>
            {listing.description}
          </p>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaBed className='text-lg' />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaBath className='text-lg' />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaParking className='text-lg' />
              {listing.parking ? 'Parking spot' : 'No Parking'}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaChair className='text-lg' />
              {listing.furnished ? 'Furnished' : 'Unfurnished'}
            </li>
          </ul>
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}
              className='w-full bg-orange-700 text-white rounded-md uppercase hover:opacity-75 p-3'
            >
              Contact landlord
            </button>
          )}
          {contact && <Contact listing={listing} />}

          {currentUser && listing.userRef !== currentUser._id && (
            reserveData.length > 0 &&
            reserveData.some((item) => item.listingRef === listingId) ? (
              <p className='w-full bg-green-400 text-black rounded-md text-center uppercase p-3'>
                YOU {reserveData.find((item) => item.listingRef === listingId).type} THIS
              </p>
            ) : (
              <Link to={`/reserve/${listingId}`}>
                <button className='w-full bg-pink-700 text-white rounded-md uppercase hover:opacity-75 p-3'>
                  Reserve
                </button>
              </Link>
            )
          )}

          <div></div>
          <ReviewSection listingId={listingId} authToken={currentUser} />
        </div>
      </div>
    )}
  </main>
);
}

