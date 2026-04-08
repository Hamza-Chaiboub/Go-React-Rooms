import { Card, CardMedia, CardContent, Typography, IconButton, Skeleton } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SelectAllOutlinedIcon from '@mui/icons-material/SelectAllOutlined';
import { useState } from "react";

type ListinCardType = {
    listingId: string;
    price: number;
    address: string;
    beds: number;
    date: string;
    area: number;
    title: string;
    areaUnit: string;
    thumbnail: [{
        ID: string;
        s3Key: string;
        AltText: string;
    } | null]
}

export const ListingCard = ({listingId, price, address, beds, date, area, title, areaUnit, thumbnail}: ListinCardType) => {
    const [isFavorite, setIsFavourite] = useState<boolean>(false)
    const handleFavouriteChange = () => {
        setIsFavourite(prev => !prev)
    }
    console.log("this is the thumbnail: ", thumbnail[0])
    return (
        <Card key={listingId} className='flex sm:flex-row flex-col grow w-72 sm:w-full shadow-none! border border-slate-200 dark:border-slate-600/75 rounded-lg! bg-slate-100! dark:bg-slate-800! dark:text-white!'>
            <div className="w-72!">
            {
                thumbnail ? (
                    <CardMedia
                        className='h-36! cursor-pointer object-cover'
                        component="img"
                        image={thumbnail[0]?.s3Key}
                        alt={thumbnail[0]?.AltText}
                        onClick={() => console.log(thumbnail[0]?.s3Key)}
                    />
                ) : (
                    <Skeleton
                        className="h-36! cursor-pointer"
                        variant="rectangular"
                        onClick={() => console.log("clicked")}
                    />
                )
            }
            </div>
            
            <CardContent className='w-full max-h-36 flex flex-col gap-3'>
                <div className='flex justify-between'>
                    <div>
                        <Typography className='flex gap-0.5'>
                            <span className='text-blue-600 dark:text-blue-500 font-bold'>${price}</span><span>/</span>month
                        </Typography>
                        <Typography fontWeight={900}>{title}</Typography>
                        <Typography fontSize={12} className='text-slate-600 dark:text-slate-400'>{address}</Typography>
                    </div>
                    <div>
                        <IconButton onClick={handleFavouriteChange} className="dark:hover:bg-slate-700! p-1! rounded-full">
                            <FavoriteIcon className={`dark:text-slate-300 ${isFavorite ? "text-red-500!" : "text-slate-300"}`} />
                        </IconButton>
                    </div>
                </div>
                <hr className='text-slate-300 dark:text-slate-600/50' />
                <div className='flex sm:justify-start justify-between items-center gap-3 text-slate-600 text-xs!'>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><KingBedOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{beds}</div></div>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><CalendarMonthOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{date}</div></div>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><SelectAllOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{area} {areaUnit}<sup>2</sup></div></div>
                </div>
            </CardContent>
        </Card>
    )
}