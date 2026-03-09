import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import WindowIcon from '@mui/icons-material/Window';

export const ListingFilters = ({ onViewChange, currentView }: { onViewChange: (styling: string) => void; currentView: 'list' | 'grid' | string }) => {
    const baseIconClass = "rounded-md p-1 box-content cursor-pointer transition-colors"
    const activeIconClass = "border border-slate-400/40 text-slate-100 bg-slate-600 dark:bg-slate-800"
    const inactiveIconClass = "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
    return (
        <div className='w-full flex gap-2 justify-between items-center'>
            <div className='flex flex-1 justify-start'>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-800 rounded-lg'>
                    <InputLabel className='rounded-md
                    text-slate-950! dark:text-slate-200!
                    [&.Mui-focused]:px-3! [&.MuiInputLabel-shrink]:px-3!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Price
                    </InputLabel>
                    <Select
                        id='price'
                        className='text-slate-950! dark:text-slate-200!'
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-800 rounded-lg'>
                    <InputLabel className='rounded-md
                    text-slate-950! dark:text-slate-200!
                    [&.Mui-focused]:px-3! [&.MuiInputLabel-shrink]:px-3!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Rooms
                    </InputLabel>
                    <Select
                        id='rooms'
                        className='text-slate-950! dark:text-slate-200!'
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3+</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 dark:bg-slate-800 rounded-lg'>
                    <InputLabel className='rounded-md
                    text-slate-950! dark:text-slate-200!
                    [&.Mui-focused]:px-3! [&.MuiInputLabel-shrink]:px-3!
                    [&.Mui-focused]:text-slate-950! [&.MuiInputLabel-shrink]:text-slate-950!
                    [&.Mui-focused]:bg-slate-200! [&.MuiInputLabel-shrink]:bg-slate-200!
                    dark:[&.Mui-focused]:bg-slate-800/75! dark:[&.MuiInputLabel-shrink]:bg-slate-800/75!
                    dark:[&.MuiInputLabel-shrink]:text-slate-200! dark:[&.Mui-focused]:text-slate-200!'
                    >
                        Distance
                    </InputLabel>
                    <Select
                        id='distance'
                        className='text-slate-950! dark:text-slate-200!'
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
                <ViewStreamIcon onClick={() => onViewChange("list")} className={`${baseIconClass} ${currentView === 'list' ? activeIconClass : inactiveIconClass}`} />
                <WindowIcon onClick={() => onViewChange("grid")} className={`${baseIconClass} ${currentView === 'grid' ? activeIconClass : inactiveIconClass}`} />
            </div>
        </div>
    )
}