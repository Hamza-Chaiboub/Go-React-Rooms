import 'leaflet/dist/leaflet.css'
import { Map } from '../components/Map'
import { Alert, Breadcrumbs, IconButton, InputBase, Link, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ListingCard } from '../components/ListingCard';
import { ListingFilters } from '../components/ListingFilters';
import { useEffect, useState } from 'react';
import { AddListingDrawer } from '../components/AddListingDrawer';
import { apiFetch } from '../api/api';

type Listing = {
    id: string;
    userId: string;
    title: string;
    description: string;
    addressLine1: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit: string;
    price: number;
    currency: string;
    availableFrom: string;
    availableUntil: string;
    minLeaseDays: number;
    isFurnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    parkingAvailable: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    thumbnail: {
        ID: string;
        S3Key: string;
        AltText: string;
    }
}

export const Find = ({ className }: {className?: string}) => {
    const apiUrl = import.meta.env.VITE_API_URL as string
    const breadcrumbs = [
        <Link href="/" key="1" className='text-inherit' >Home</Link>,
        <Typography className='text-slate-950 dark:text-slate-300'>Find</Typography>
    ]

    const [viewMode, setViewMode] = useState<'list' | 'grid' | string>('flex-col lg:flex-row')
    const [openDrawer, setOpenDrawer] = useState(false)
    const [listings, setListings] = useState<Listing[]>([])
    const [isLoadingListings, setIsLoadingListings] = useState<boolean>(false)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

    const handleViewChange = (mode: 'list' | 'grid' | string) => {
        setViewMode(mode)
    }

    const handleClickOpenDrawer = () => setOpenDrawer(true)
    const handleClickCloseDrawer = () => setOpenDrawer(false)
    const refreshListings = () => setRefreshTrigger(prev => prev + 1)
    useEffect(() => {
        setIsLoadingListings(true)
        async function getAllListings() {
            const res = await apiFetch(`${apiUrl}`, "/listings")

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }

            const listingsList = await res.json()
            setListings(listingsList.listings)
            console.log(listingsList)
        }

        getAllListings()
        setIsLoadingListings(false)
    }, [apiUrl, refreshTrigger])
    return (
        <>
        <div className={`flex flex-col lg:flex-row px-2 md:px-2 ${className}`}>
            <Map className='w-full lg:w-2xl lg:fixed rounded-2xl h-96 mt-16 lg:bg-slate-800! bg-none z-10' />
            <section className='w-full lg:w-2/3 p-4 flex flex-col gap-8 lg:mt-0 lg:ml-168'>
                <header className='flex flex-col gap-4 text-slate-950 dark:text-slate-200'>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' className='text-slate-800 dark:text-slate-500' />}>{breadcrumbs}</Breadcrumbs>
                    <div>
                        <Typography fontSize={28} fontWeight={900} className='font-sans! text-slate-700! dark:text-slate-100!'>Find your roommate(s)</Typography>
                        <Typography>{listings && listings.length > 0 ? listings.length : 0} people found</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center flex-1 border rounded-md border-slate-600 dark:bg-slate-800'>
                            <IconButton className='text-blue-500!'>
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder='Search...'
                                className='text-slate-950! dark:text-slate-200!'
                            />
                        </div>
                        <div>
                            <IconButton onClick={handleClickOpenDrawer} className='text-slate-200! bg-blue-600! rounded-md!'>
                                <AddIcon />
                                <Typography fontWeight={700} fontSize={14}>List New</Typography>
                            </IconButton>
                            <AddListingDrawer isOpen={openDrawer} closeDrawer={handleClickCloseDrawer} onSuccess={refreshListings} />
                        </div>
                    </div>
                    <ListingFilters onViewChange={handleViewChange} currentView={viewMode} />
                </header>
                <div className={`flex ${viewMode === 'list' ? 'flex-col' : viewMode === 'grid' ? 'flex-row' : viewMode} flex-wrap gap-4`}>
                    {!isLoadingListings ? (
                        listings && listings.length > 0 ? ( listings.map(listing => {
                            const dateListed = new Date(listing.createdAt).toLocaleDateString('en-CA')
                            return (
                                <ListingCard
                                    key={listing.id}
                                    listingId={listing.id}
                                    price={listing.price}
                                    address={listing.addressLine1}
                                    beds={listing.bedrooms}
                                    date={dateListed}
                                    area={listing.area}
                                    areaUnit={listing.areaUnit === "sqm" ? "m" : "f"}
                                    title={listing.title}
                                    thumbnail={listing.thumbnail} />
                            )})) : (
                                <Alert className='w-full rounded-lg!' severity="info">No listings found.</Alert>
                            )
                    ): (
                        <div>Loading</div>
                    )}
                </div>
            </section>
        </div>
        </>
    )
}