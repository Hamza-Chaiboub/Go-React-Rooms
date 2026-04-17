import { Button, Divider, FormControl, Input, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import WhiteHeroImageTransparent from '../assets/white-hero-transparent.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { filterFields } from "../pages/Home";
import type { Dispatch, SetStateAction } from "react";

type FilterProps = {
    filter: filterFields
    setFilter: Dispatch<SetStateAction<filterFields>>
}

export const Hero = ({ filter, setFilter }: FilterProps) => {
    const handleFilterChange = (e: SelectChangeEvent) => {
        setFilter((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <section
            id="home-hero"
            className="w-full min-h-[70dvh] bg-cover bg-center bg-no-repeat flex flex-col dark:text-slate-300"
            style={{
                backgroundImage: `url(${WhiteHeroImageTransparent})`,
            }}
        >
            <div className="flex flex-col items-center pt-16 px-4 text-center">
                <h1 className="text-4xl font-bold">Find it, love it, live there.</h1>
                <h3 className="text-lg italic text-slate-500">
                    Find the roommate that matches your vibe
                </h3>
            </div>

            <div className="flex items-center justify-center px-4">
                <div className="flex flex-wrap gap-4 justify-center items-center border border-slate-400 rounded-2xl bg-slate-100/80 dark:bg-slate-600/95 mt-16 px-8 py-2 shadow-xl/30">
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel shrink={true} id="property-label" className="dark:text-slate-200!">Property</InputLabel>
                        <Select
                            labelId="property-label"
                            id="property"
                            name="property"
                            label="Property"
                            input={<Input disableUnderline />}
                            IconComponent={ExpandMoreIcon}
                            value={filter.property}
                            onChange={handleFilterChange}
                            className='font-black! dark:text-slate-200! [&_.MuiSvgIcon-root]:text-blue-600! dark:[&_.MuiSvgIcon-root]:text-slate-50!'
                        >
                            <MenuItem value={"apartment"}>Apartment</MenuItem>
                            <MenuItem value={"room"}>Room</MenuItem>
                            <MenuItem value={"basement"}>Basement</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel shrink={true} id="city-label" className="dark:text-slate-200!">City</InputLabel>
                        <Select
                            labelId="city-label"
                            id="city"
                            name="city"
                            label="City"
                            input={<Input disableUnderline />}
                            IconComponent={ExpandMoreIcon}
                            value={filter.city}
                            onChange={handleFilterChange}
                            className='font-black! dark:text-slate-200! [&_.MuiSvgIcon-root]:text-blue-600! dark:[&_.MuiSvgIcon-root]:text-slate-50!'
                        >
                            <MenuItem value={"ottawa"}>Ottawa</MenuItem>
                            <MenuItem value={"montreal"}>Montreal</MenuItem>
                            <MenuItem value={"toronto"}>Toronto</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel shrink={true} id="beds-label" className="dark:text-slate-200!">Beds</InputLabel>
                        <Select
                            labelId="beds-label"
                            id="beds"
                            name="beds"
                            label="Beds"
                            input={<Input disableUnderline />}
                            IconComponent={ExpandMoreIcon}
                            value={filter.beds}
                            onChange={handleFilterChange}
                            className='font-black! dark:text-slate-200! [&_.MuiSvgIcon-root]:text-blue-600! dark:[&_.MuiSvgIcon-root]:text-slate-50!'
                        >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3+"}>3+</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel shrink={true} id="baths-label" className="dark:text-slate-200!">Baths</InputLabel>
                        <Select
                            labelId="baths-label"
                            id="baths"
                            name="baths"
                            label="Baths"
                            input={<Input disableUnderline />}
                            IconComponent={ExpandMoreIcon}
                            value={filter.baths}
                            onChange={handleFilterChange}
                            className='font-black! dark:text-slate-200! [&_.MuiSvgIcon-root]:text-blue-600! dark:[&_.MuiSvgIcon-root]:text-slate-50!'
                        >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"1.5"}>1.5</MenuItem>
                            <MenuItem value={"2+"}>2+</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel shrink={true} id="budget-label" className="dark:text-slate-200!">Budget</InputLabel>
                        <Select
                            labelId="budget-label"
                            id="budget"
                            name="budget"
                            label="Budget"
                            input={<Input disableUnderline />}
                            IconComponent={ExpandMoreIcon}
                            value={filter.budget}
                            onChange={handleFilterChange}
                            className='font-black! dark:text-slate-200! [&_.MuiSvgIcon-root]:text-blue-600! dark:[&_.MuiSvgIcon-root]:text-slate-50!'
                        >
                            <MenuItem value={"500"}>$0 - $500</MenuItem>
                            <MenuItem value={"1000"}>$500 - $1000</MenuItem>
                            <MenuItem value={"1000+"}>$1000+</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <Button className='h-10! bg-blue-600! rounded-md!' variant="contained" onClick={() => console.log(filter)}>Search</Button>
                </div>
            </div>
        </section>
    )
}