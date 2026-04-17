import { useState } from 'react';
import { Hero } from '../components/Hero';
import { ListingCard } from '../components/ListingCard';
import { useListings } from '../hooks/useListings';
import { Alert, Button, Divider } from '@mui/material';
import CardOne from '../assets/CardOne.png'
import CardTwo from '../assets/CardTwo.png'
import Ottawa from '../assets/ottawa.jpg'
import Toronto from '../assets/toronto.jpg'

export type filterFields = {
    property: string;
    city: string;
    beds: string;
    baths: string;
    budget: string;
}

export const Home = ({ className = "" }: { className?: string }) => {
    const { listings, isLoading, error } = useListings()
    const [filter, setFilter] = useState<filterFields>({
        property: 'apartment',
        city: 'ottawa',
        beds: "1",
        baths: "1",
        budget: "500"
    })

    return (
        <div className={className}>
            <Hero filter={filter} setFilter={setFilter} />
            <section className="mt-12 px-4 sm:px-6 lg:px-8">
                <div className='flex flex-col items-center mb-12'>
                    <h3 className='text-2xl text-slate-400 mb-2'>Featured Listings</h3>
                    <Divider className='w-16 mx-auto! border-b-6! bg-blue-600 rounded-xl' orientation="horizontal" variant="middle" flexItem />
                </div>
                <div className="mx-auto mb-12 max-w-7xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
                    {isLoading ? (
                        <div className='col-span-full'>Loading...</div>
                    ) : error ? (
                        <Alert className='col-span-full w-full rounded-lg!' severity='error'>
                            {error}
                        </Alert>
                    ) : listings.length > 0 ? (
                        listings.map((listing) => {
                            // const dateListed = new Date(listing.createdAt).toLocaleDateString('en-CA')

                            return (
                                <ListingCard
                                    key={listing.id}
                                    listingId={listing.id}
                                    price={listing.price}
                                    address={listing.addressLine1}
                                    beds={listing.bedrooms}
                                    baths={listing.bathrooms}
                                    area={listing.area}
                                    areaUnit={listing.areaUnit === "sqm" ? "m" : "f"}
                                    title={listing.title}
                                    thumbnail={listing.thumbnail}
                                    className="flex-col! sm:flex-col! w-72! sm:w-72! grow-0!"
                                />
                            )
                        })
                    ) : (
                        <Alert className='col-span-full w-full rounded-lg!' severity='info'>
                            No listings found.
                        </Alert>
                    )}
                </div>
            </section>
            <section className='flex flex-col bg-slate-50 pt-12 pb-36 px-24'>

                <div className='flex flex-col items-center mb-12'>
                    <h3 className='text-2xl text-slate-400 mb-2'>How it works</h3>
                    <Divider className='w-16 mx-auto! border-b-6! bg-blue-600 rounded-xl' orientation="horizontal" variant="middle" flexItem />
                </div>

                <div className='flex gap-2 justify-around items-center mb-36'>
                    <div className='relative w-1/3 h-96'>
                        <img src={CardOne} className="absolute inset-0 rounded-2xl -translate-x-20 translate-y-6" />
                        <img src={CardTwo} className="absolute inset-0 rounded-2xl translate-x-20 -translate-y-10" />
                        <img src={CardOne} className="absolute inset-0 rounded-2xl translate-x-5 translate-y-20" />
                    </div>
                    <div className='w-1/3 flex flex-col items-start gap-12'>
                        <h1 className='text-3xl'>Search & Find Your Place</h1>
                        <p className=''>Roomie has the scoop on the best apartments and rooms in Candada, unlisted and fresh on the market. We'll work your budget and your preferences to find your perfect place.</p>
                        <Button className='h-10! w-48! bg-blue-600! rounded-md!' variant="contained">Search Listing</Button>
                    </div>
                </div>

                <div className='flex gap-2 justify-around items-center px-24'>
                    <div className='w-1/3 flex flex-col items-start gap-12'>
                        <h1 className='text-3xl'>Search & Find Your Place</h1>
                        <p className=''>Roomie has the scoop on the best apartments and rooms in Candada, unlisted and fresh on the market. We'll work your budget and your preferences to find your perfect place.</p>
                        <Button className='h-10! w-48! bg-blue-600! rounded-md!' variant="contained">Search Listing</Button>
                    </div>
                    <div className='relative w-1/3 h-96'>
                        <img src={CardOne} className="absolute inset-0 rounded-2xl -translate-x-20 translate-y-6" />
                        <img src={CardTwo} className="absolute inset-0 rounded-2xl translate-x-20 -translate-y-2" />
                        <img src={CardOne} className="absolute inset-0 rounded-2xl translate-x-5 translate-y-20" />
                    </div>
                </div>
            </section>
            <section className='flex flex-col py-12 px-24'>

                <div className='flex flex-col items-center mb-12'>
                    <h3 className='text-2xl text-slate-400 mb-2'>Neighbourhood</h3>
                    <Divider className='w-16 mx-auto! border-b-6! bg-blue-600 rounded-xl' orientation="horizontal" variant="middle" flexItem />
                </div>

                <div className='flex justify-around'>
                    <div
                        className="h-96 w-96 rounded-xl"
                        style={{
                            backgroundImage: `url(${Ottawa})`
                        }}
                    >
                        <div className='flex items-center justify-center bg-black/10 w-full h-full rounded-xl'>
                            <p className='text-7xl font-black text-slate-50'>Ottawa</p>
                        </div>
                    </div>
                    <div
                        className="h-96 w-96 rounded-xl"
                        style={{
                            backgroundImage: `url(${Toronto})`
                        }}
                    >
                        <div className='flex items-center justify-center bg-black/10 w-full h-full rounded-xl'>
                            <p className='text-7xl font-black text-slate-50'>Toronto</p>
                        </div>
                    </div>
                </div>

            </section>
            <section id="testimonials" aria-label="What our customers are saying" className="bg-slate-50 py-20 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl md:text-center">
                        <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">What Our Customers Are Saying</h2>
                    </div>
                    <ul role="list"
                        className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                        <li>
                            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                                <li>
                                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10"><svg aria-hidden="true"
                                        width="105" height="78" className="absolute left-6 top-6 fill-slate-100">
                                        <path
                                            d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z">
                                        </path>
                                    </svg>
                                        <blockquote className="relative">
                                            <p className="text-lg tracking-tight text-slate-900">I was nervous about moving to a new city alone. This app helped me find a roommate with similar lifestyle habits and a shared love for cooking. We’ve been living together for six months and couldn't be happier!</p>
                                        </blockquote>
                                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                            <div>
                                                <div className="font-display text-base text-slate-900">Sheryl Berge</div>
                                            </div>
                                            <div className="overflow-hidden rounded-full bg-slate-50">
                                                <img alt="" className="h-14 w-14 object-cover" style={{color : 'transparent'}} src="https://randomuser.me/api/portraits/men/15.jpg" />
                                            </div>
                                        </figcaption>
                                    </figure>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                                <li>
                                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10"><svg aria-hidden="true"
                                        width="105" height="78" className="absolute left-6 top-6 fill-slate-100">
                                        <path
                                            d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z">
                                        </path>
                                    </svg>
                                        <blockquote className="relative">
                                            <p className="text-lg tracking-tight text-slate-900">I needed a place in Ottawa fast, and the verified profiles gave me peace of mind. I found a great apartment and met my new flatmate within three days. The in-app chat made vetting super easy!</p>
                                        </blockquote>
                                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                            <div>
                                                <div className="font-display text-base text-slate-900">Leland Kiehn</div>
                                            </div>
                                            <div className="overflow-hidden rounded-full bg-slate-50">
                                                <img alt="" className="h-14 w-14 object-cover" style={{color : 'transparent'}} src="https://randomuser.me/api/portraits/women/15.jpg" />
                                            </div>
                                        </figcaption>
                                    </figure>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                                <li>
                                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10"><svg aria-hidden="true"
                                        width="105" height="78" className="absolute left-6 top-6 fill-slate-100">
                                        <path
                                            d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z">
                                        </path>
                                    </svg>
                                        <blockquote className="relative">
                                            <p className="text-lg tracking-tight text-slate-900">I was struggling to find affordable housing near my campus. The location-based search and filters helped me narrow down places within my budget quickly. Highly recommend!</p>
                                        </blockquote>
                                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                            <div>
                                                <div className="font-display text-base text-slate-900">Peter Renolds</div>
                                            </div>
                                            <div className="overflow-hidden rounded-full bg-slate-50">
                                                <img alt="" className="h-14 w-14 object-cover" style={{color : 'transparent'}} src="https://randomuser.me/api/portraits/men/10.jpg" />
                                            </div>
                                        </figcaption>
                                    </figure>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}