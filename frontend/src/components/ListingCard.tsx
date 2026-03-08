import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SelectAllOutlinedIcon from '@mui/icons-material/SelectAllOutlined';
import Flat from '../assets/flat.webp'

type ListinCardType = {
    price: number;
    address: string;
    beds: number;
    date: string;
    area: number;
}

export const ListingCard = ({price, address, beds, date, area}: ListinCardType) => {
    return (
        <Card className='flex shadow-none! border border-slate-200 dark:border-slate-600/75 rounded-lg! bg-slate-100! dark:bg-slate-800! dark:text-white!'>
            <CardMedia
                className='h-36 w-46!'
                component="img"
                image={Flat}
            />
            <CardContent className='w-full max-h-36 flex flex-col gap-3'>
                <div className='flex justify-between'>
                    <div>
                        <Typography className='flex gap-0.5'>
                            <span className='text-blue-600 dark:text-blue-500 font-bold'>${price}</span><span>/</span>month
                        </Typography>
                        <Typography fontWeight={900}>Flat for rent</Typography>
                        <Typography fontSize={12} className='text-slate-600 dark:text-slate-400'>{address}</Typography>
                    </div>
                    <div>
                        <IconButton className="dark:hover:bg-slate-700! p-1! rounded-full">
                            <FavoriteBorderOutlinedIcon className="dark:text-slate-300" />
                        </IconButton>
                    </div>
                </div>
                <hr className='text-slate-300 dark:text-slate-600/50' />
                <div className='flex items-center gap-3 text-slate-600 text-xs!'>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><KingBedOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{beds}</div></div>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><CalendarMonthOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{date}</div></div>
                    <div className='flex items-center gap-1 text-slate-950 dark:text-slate-200'><SelectAllOutlinedIcon/> <div className='text-slate-600 dark:text-slate-400'>{area} m<sup>2</sup></div></div>
                </div>
            </CardContent>
        </Card>
    )
}