import { FormControl, Switch } from "@mui/material"
import { useEffect, useState } from "react"
import Select, { type PropsValue, } from "react-select"

interface CountryProvinceCityOption {
    value: string;
    label: string;
}

export const LocationAndAvailabilityStep = () => {
    const [preciseLocation, setPreciseLocation] = useState<boolean>(false)
    const [country, setCountry] = useState<PropsValue<CountryProvinceCityOption> | null>(null)
    const [postalZipCode, setPostalZipCode] = useState<string>('')
    const [province, setProvince] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [street, setStreet] = useState<string>('')
    const [blockNumber, setBlockNumber] = useState<string>('')
    const countryOptions: CountryProvinceCityOption[] = [
        { value: 'CA', label: 'Canada' },
        { value: 'US', label: 'United States' }
    ]

    const handlePreciseLocation = () => {
        setPreciseLocation(prev => !prev)
    }
    const handleCountryChange = (country: PropsValue<CountryProvinceCityOption>) => {
        setCountry(country)
    }
    const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProvince(e.target.value)
    }
    const handlePostalZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostalZipCode(e.target.value)
    }
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value)
    }
    const handleStreet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(e.target.value)
    }
    const handleBlockNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockNumber(e.target.value)
    }

    useEffect(() => {
        if (!preciseLocation) {
            console.log("precise location not selected")
            setCountry(null);
            setPostalZipCode('');
            setProvince('');
            setCity('');
            setStreet('')
            setBlockNumber('')
            return;
        };
        if (!navigator.geolocation) {
            console.log("geolocation disabled")
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    const addressData = await reverseGeocode(latitude, longitude)
                    console.log(addressData)
                    autoLoadAddress(addressData.address)
                } catch (error) {
                    console.error('reverse geocoding failed:', error)
                }
            },
            (err) => {
                console.error(err)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
    }, [preciseLocation])

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
        console.log(data["ISO3166-2-lvl4"].split("-")[1]);
        console.log(data);
        setCountry({ value: data.country_code.toUpperCase(), label: data.country });
        setPostalZipCode(data.postcode);
        setProvince(data.state);
        setCity(data.city);
        setStreet(data.road)
        setBlockNumber(data.house_number)
    }
    return (
        <div>
            <section className="flex justify-end items-center gap-4 my-4">

                <span>Autofill: </span>
                <Switch checked={preciseLocation} onChange={handlePreciseLocation}></Switch>
            </section>
            <section className="flex gap-4 my-4">
                {/* Coutry */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Country</span>
                    <Select<CountryProvinceCityOption> options={countryOptions} value={country} onChange={handleCountryChange} />
                </FormControl>
                {/* postal / zip code */}
                <FormControl className="w-1/2">
                    <span className="mb-2">
                        {(country as CountryProvinceCityOption)?.value === "CA" ? "Postal Code" : ((country as CountryProvinceCityOption)?.value === 'US' ? "Zip Code" : "Postal / Zip Code")}
                    </span>
                    <input
                        type="text"
                        disabled={!country}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handlePostalZipCode}
                        value={postalZipCode} />
                </FormControl>
            </section>
            <section className="flex gap-4 my-4">
                {/* province / state */}
                <FormControl className="w-1/2">
                    <span className="mb-2">
                        {(country as CountryProvinceCityOption)?.value === "CA" ? 'Provice' : ((country as CountryProvinceCityOption)?.value === 'US' ? "State" : "Province / State")}
                    </span>
                    <input
                        type="text"
                        disabled={!postalZipCode}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleProvinceChange}
                        value={province}
                    />
                </FormControl>
                {/* city */}
                <FormControl className="w-1/2">
                    <span className="mb-2">City</span>
                    <input
                        type="text"
                        disabled={!province}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleCityChange}
                        value={city}
                    />
                </FormControl>
            </section>
            <section className="flex gap-4 my-4">
                {/* street */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Street</span>
                    <input
                        type="text"
                        disabled={!city}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleStreet}
                        value={street}
                    />
                </FormControl>
                {/* block N */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Block Number</span>
                    <input
                        type="text"
                        disabled={!street}
                        className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 w-full p-1.5 dark:text-slate-200! rounded-lg disabled:bg-slate-200!'
                        onChange={handleBlockNumber}
                        value={blockNumber}
                    />
                </FormControl>
            </section>
            <button onClick={() => console.log((country as CountryProvinceCityOption)?.value)}>save</button>
        </div>
    )
}