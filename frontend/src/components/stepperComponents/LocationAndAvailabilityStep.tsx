import { FormControl, Switch } from "@mui/material"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import Select, { type PropsValue, } from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import NumberField from "../NumberField"
import type { ListingFormData } from "../AddListingDrawer"

type LocationAndAvailabilityStepProps = {
    formData: ListingFormData
    setFormData: Dispatch<SetStateAction<ListingFormData>>
}

export interface CountryOption {
    value: string;
    label: string;
}
export interface UnitOptions extends CountryOption {}

const TODAY = new Date();

export const LocationAndAvailabilityStep = ({ formData, setFormData }: LocationAndAvailabilityStepProps) => {
    const [loadingPreciseLocation, setLoadingPreciseLocation] = useState<boolean>(false)
    const [isAuto, setIsAuto] = useState<boolean>(false)

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            startDate: TODAY
        }))
    }, [])

    const countryOptions: CountryOption[] = [
        { value: 'CA', label: 'Canada' },
        { value: 'US', label: 'United States' }
    ]
    const durationUnitOptions: UnitOptions[] = [
        { value: 'day', label: 'Days' },
        { value: 'week', label: 'Weeks' },
        { value: 'month', label: 'Months' },
        { value: 'year', label: 'Years' }
    ] ;

    const handlePreciseLocation = () => {
        setFormData(prev => ({
            ...prev,
            preciseLocation: !prev.preciseLocation
        }))
        console.log("precise location settings changed")
    }
    const handleCountryChange = (country: PropsValue<CountryOption>) => {
        setFormData(prev => ({
            ...prev,
            country: country
        }))
    }
    const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            province: e.target.value
        }))
    }
    const handlePostalZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            postalCode: e.target.value
        }))
    }
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            city: e.target.value
        }))
    }
    const handleStreet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            street: e.target.value
        }))
    }
    const handleBlockNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            blockNumber: e.target.value
        }))
    }
    const handleStartDate = (date: Date | null) => {
        setFormData(prev => ({
            ...prev,
            startDate: date
        }))
    }
    const handleEndDate = (date: Date | null) => {
        setFormData(prev => ({
            ...prev,
            endDate: date
        }))
    }
    const handleDurationChange = (duration: number | null) => {
        setFormData(prev => ({
            ...prev,
            duration: duration
        }))
    }
    const handleDurationUnitChange = (unit: PropsValue<UnitOptions>) => {
        setFormData(prev => ({
            ...prev,
            durationUnit: unit
        }))
    }

    useEffect(() => {
        if (!formData.preciseLocation) {
            setIsAuto(false)
            console.log("precise location not selected")
            setFormData(prev => ({
                ...prev,
                country: formData.country,
                postalCode: formData.postalCode,
                province: formData.province,
                city: formData.city,
                street: formData.street,
                blockNumber: formData.blockNumber
            }))
            return;
        };
        if (!navigator.geolocation) {
            console.log("geolocation disabled")
            return;
        }
        setLoadingPreciseLocation(true)
        setIsAuto(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    const addressData = await reverseGeocode(latitude, longitude)
                    // console.log(addressData)
                    autoLoadAddress(addressData.address)
                } catch (error) {
                    console.error('reverse geocoding failed:', error)
                } finally {
                    setLoadingPreciseLocation(false)
                }
            },
            (err) => {
                console.error(err)
                setLoadingPreciseLocation(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
    }, [formData.preciseLocation])

    const reverseGeocode = async (lat: number, lon: number) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Roomie/1.0 (hamzachb93@gmail.com)'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
    }

    const autoLoadAddress = (data: any) => {
        // console.log(data["ISO3166-2-lvl4"].split("-")[1]);
        // console.log(data);
        setFormData(prev => ({
            ...prev,
            country: { value: data.country_code.toUpperCase(), label: data.country },
            postalCode: data.postcode,
            province: data.state,
            city: data.city,
            street: data.road,
            blockNumber: data.house_number
        }))
    }
    return (
        <div className="mb-4">
            <section className="flex justify-end items-center gap-4 my-4">

                <span>Autofill: </span>
                <Switch disabled={loadingPreciseLocation} checked={formData.preciseLocation} onChange={handlePreciseLocation}></Switch>
            </section>
            <section className="flex gap-4 my-4">
                {/* Coutry */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Country</span>
                    <Select<CountryOption> isDisabled={isAuto} options={countryOptions} value={formData.country} onChange={handleCountryChange} />
                </FormControl>
                {/* postal / zip code */}
                <FormControl className="w-1/2">
                    <span className="mb-2">
                        {(formData.country as CountryOption)?.value === "CA" ? "Postal Code" : ((formData.country as CountryOption)?.value === 'US' ? "Zip Code" : "Postal / Zip Code")}
                    </span>
                    <input
                        type="text"
                        disabled={!formData.country || isAuto}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handlePostalZipCode}
                        value={formData.postalCode} />
                </FormControl>
            </section>
            <section className="flex gap-4 my-4">
                {/* province / state */}
                <FormControl className="w-1/2">
                    <span className="mb-2">
                        {(formData.country as CountryOption)?.value === "CA" ? 'Provice' : ((formData.country as CountryOption)?.value === 'US' ? "State" : "Province / State")}
                    </span>
                    <input
                        type="text"
                        disabled={!formData.postalCode || isAuto}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleProvinceChange}
                        value={formData.province}
                    />
                </FormControl>
                {/* city */}
                <FormControl className="w-1/2">
                    <span className="mb-2">City</span>
                    <input
                        type="text"
                        disabled={!formData.province || isAuto}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleCityChange}
                        value={formData.city}
                    />
                </FormControl>
            </section>
            <section className="flex gap-4 my-4">
                {/* street */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Street</span>
                    <input
                        type="text"
                        disabled={!formData.city || isAuto}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleStreet}
                        value={formData.street}
                    />
                </FormControl>
                {/* block N */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Block Number</span>
                    <input
                        type="text"
                        disabled={!formData.street || isAuto}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleBlockNumber}
                        value={formData.blockNumber}
                    />
                </FormControl>
            </section>
            {/* date availability */}
            <section className="flex justify-between gap-4 my-4">
                <FormControl className="w-1/2">
                    <span className="mb-2">Available From</span>
                    <div>
                        <DatePicker
                            selected={formData.startDate || TODAY}
                            onChange={handleStartDate}
                            selectsStart
                            startDate={formData.startDate || TODAY}
                            endDate={formData.endDate}
                            minDate={TODAY}
                            inline
                        />
                    </div>
                </FormControl>
                <FormControl className="w-1/2">
                    <span className="mb-2">Available Until</span>
                    <div>
                        <DatePicker
                            selected={formData.endDate}
                            selectsEnd
                            startDate={formData.startDate || TODAY}
                            endDate={formData.endDate}
                            minDate={TODAY}
                            onChange={handleEndDate}
                            inline
                        />
                    </div>
                </FormControl>
            </section>
            {/* duration */}
            <section>
                <FormControl className="">
                    <span className="mb-2">Duration</span>
                </FormControl>
                <div className="flex gap-4">
                    <NumberField
                        size="small"
                        min={0}
                        value={formData.duration}
                        onValueChange={(value) => handleDurationChange(value)}
                        outlineClassName="
                            rounded-3xl!
                            bg-white dark:bg-slate-600
                            [&_.MuiOutlinedInput-notchedOutline]:border-slate-300
                            dark:[&_.MuiOutlinedInput-notchedOutline]:border-slate-600
                            [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-blue-500
                            dark:[&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-blue-400
                        "
                        inputClassName="text-slate-900 dark:text-slate-100! px-3"
                        adornmentClassName="border-l border-slate-300 dark:border-slate-600"
                        buttonClassName="text-slate-500 hover:bg-slate-100 dark:text-slate-400! dark:hover:bg-slate-800"
                    />
                    <Select<UnitOptions>
                        options={durationUnitOptions}
                        value={formData.durationUnit}
                        onChange={handleDurationUnitChange}
                        classNames={{
                            control: () => 'rounded-3xl!'
                        }}
                    />
                </div>
            </section>
        </div>
    )
}