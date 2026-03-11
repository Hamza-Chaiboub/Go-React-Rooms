import 'leaflet/dist/leaflet.css'
import { Map } from '../components/Map'
import { Breadcrumbs, IconButton, InputBase, Link, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ListingCard } from '../components/ListingCard';
import { ListingFilters } from '../components/ListingFilters';
import { useState } from 'react';
import { AddListingDrawer } from '../components/AddListingDrawer';

export const Find = () => {
    const breadcrumbs = [
        <Link href="/" key="1" className='text-inherit' >Home</Link>,
        <Typography className='text-slate-950 dark:text-slate-300'>Find</Typography>
    ]

    const [viewMode, setViewMode] = useState<'list' | 'grid' | string>('flex-col lg:flex-row')
    const [openDrawer, setOpenDrawer] = useState(false)

    const handleViewChange = (mode: 'list' | 'grid' | string) => {
        setViewMode(mode)
    }

    const handleClickOpenDrawer = () => setOpenDrawer(true)
    const handleClickCloseDrawer = () => setOpenDrawer(false)
    return (
        <>
        <div className='flex flex-col lg:flex-row ml-16 lg:ml-64 px-2 md:px-2'>
            <Map className='w-full lg:w-2xl lg:fixed rounded-2xl h-96 mt-16 lg:bg-slate-800! bg-none z-10' />
            <section className='w-full lg:w-2/3 p-4 flex flex-col gap-8 lg:mt-0 lg:ml-168'>
                <header className='flex flex-col gap-4 text-slate-950 dark:text-slate-200'>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' className='text-slate-800 dark:text-slate-500' />}>{breadcrumbs}</Breadcrumbs>
                    <div>
                        <Typography fontSize={28} fontWeight={900} className='font-sans! text-slate-700! dark:text-slate-100!'>Find your roommate(s)</Typography>
                        <Typography>376 people found</Typography>
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
                            <AddListingDrawer isOpen={openDrawer} closeDrawer={handleClickCloseDrawer} />
                        </div>
                    </div>
                    <ListingFilters onViewChange={handleViewChange} currentView={viewMode} />
                </header>
                <div className={`flex ${viewMode === 'list' ? 'flex-col' : viewMode === 'grid' ? 'flex-row' : viewMode} flex-wrap gap-4`}>
                    <ListingCard price={420} address="Ottawa, Slater st." beds={2} date='2026-03-07' area={68} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                </div>
            </section>
        </div>
        </>
    )
}