import 'leaflet/dist/leaflet.css'
import { Map } from '../components/Map'
import { Breadcrumbs, IconButton, InputBase, Link, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search';
import { ListingCard } from '../components/ListingCard';
import { ListingFilters } from '../components/ListingFilters';

const position = [45.41699, -75.70481]

export const Find = () => {
    const breadcrumbs = [
        <Link href="/" key="1" className='text-inherit' >Home</Link>,
        <Typography className='text-slate-950 dark:text-slate-300'>Find</Typography>
    ]
    return (
        <>
        <div className='flex'>
            <Map className='w-1/2 h-screen' position={position} />
            <section className='w-1/2 p-4 flex flex-col gap-8'>
                <header className='flex flex-col gap-4 text-slate-950 dark:text-slate-200'>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' className='text-slate-800 dark:text-slate-500' />}>{breadcrumbs}</Breadcrumbs>
                    <div>
                        <Typography fontSize={28} fontWeight={900} className='font-sans! text-slate-700! dark:text-slate-100!'>Find your roommate(s)</Typography>
                        <Typography>376 people found</Typography>
                    </div>
                    <div className='flex items-center w-full border rounded-md border-slate-300 bg-slate-100'>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder='Search...'
                        />
                    </div>
                    <ListingFilters />
                </header>
                <div className='flex flex-col lg:flex-row flex-wrap gap-4'>
                    <ListingCard price={420} address="Ottawa, Slater st." beds={2} date='2026-03-07' area={68} />
                    <ListingCard price={630} address="Ottawa, Albert st." beds={4} date='2026-01-12' area={112} />
                </div>
            </section>
        </div>
        </>
    )
}