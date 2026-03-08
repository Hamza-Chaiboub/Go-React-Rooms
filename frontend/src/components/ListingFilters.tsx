import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import WindowIcon from '@mui/icons-material/Window';

export const ListingFilters = () => {
    return (
        <div className='w-full flex gap-2 justify-between items-center'>
            <div className='flex flex-1 justify-start'>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-100 rounded-lg'>
                    <InputLabel className='rounded-md
                    [&.Mui-focused]:px-1! [&.MuiInputLabel-shrink]:px-1!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Price
                    </InputLabel>
                    <Select
                        id='price'
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-100 rounded-lg'>
                    <InputLabel className='rounded-md
                    [&.Mui-focused]:px-1! [&.MuiInputLabel-shrink]:px-1!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Rooms
                    </InputLabel>
                    <Select
                        id='rooms'
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3+</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-100 rounded-lg'>
                    <InputLabel className='rounded-md
                    [&.Mui-focused]:px-1! [&.MuiInputLabel-shrink]:px-1!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Distance
                    </InputLabel>
                    <Select
                        id='distance'
                    >
                        <MenuItem value={1}>1km</MenuItem>
                        <MenuItem value={2}>2km</MenuItem>
                        <MenuItem value={3}>3km</MenuItem>
                        <MenuItem value={4}>4km</MenuItem>
                        <MenuItem value={5}>5+km</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='flex items-center gap-2 h-full'>
                <ViewStreamIcon className='border border-slate-400/40 text-slate-100 bg-slate-600 hover:bg-slate-600 hover:text-slate-100 dark:bg-slate-800 rounded-md p-1 box-content cursor-pointer' />
                <WindowIcon className='rounded-md p-1 box-content cursor-pointer hover:bg-slate-600 hover:text-slate-100' />
            </div>
        </div>
    )
}