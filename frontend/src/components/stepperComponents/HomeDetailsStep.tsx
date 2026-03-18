import { FormControl, InputBase, MenuItem, Select, ToggleButton, ToggleButtonGroup, type SelectChangeEvent } from "@mui/material"
import { type Dispatch, type SetStateAction } from "react"
import NumberField from "../NumberField"
import type { ListingFormData } from "../AddListingDrawer"

type HomeDetailsStepProps = {
    formData: ListingFormData
    setFormData: Dispatch<SetStateAction<ListingFormData>>
}

export const HomeDetailsStep = ({ formData, setFormData }: HomeDetailsStepProps) => {

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            title: e.target.value
        }))
    }

    const handleBedrooms = (_e: React.MouseEvent<HTMLElement>, data: number | string | null) => {
        if (data === 'custom') {
            setFormData(prev => ({
                ...prev,
                isCustomBedroom: true
            }))
            return
        }

        setFormData(prev => ({
            ...prev,
            isCustomBedroom: false,
            bedrooms: typeof data === "number" ? data : null
        }))
    }

    const handleBathrooms = (_e: React.MouseEvent<HTMLElement>, data: number | string | null) => {
        if (data === 'custom') {
            setFormData(prev => ({
                ...prev,
                isCustomBathroom: true
            }))
            return
        }

        setFormData(prev => ({
            ...prev,
            isCustomBathroom: false,
            bathrooms: typeof data === "number" ? data : null
        }))
    }

    const handleIsFurnished = (_e: React.MouseEvent<HTMLElement>, data: boolean) => {
        setFormData(prev => ({
            ...prev,
            isFurnished: data
        }))
    }

    const handleArea = (data: number | string | null) => {
        setFormData(prev => ({
            ...prev,
            area: typeof data === "number" ? data : null
        }))
    }

    const handleAreaUnit = (e: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            areaUnit: e.target.value
        }))
    }

    const handleParking = (_e: React.MouseEvent<HTMLElement>, data: boolean) => {
        setFormData(prev => ({
            ...prev,
            parking: data
        }))
    }

    return (
        <div className="flex flex-col gap-4 my-4">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className='flex-1 flex-col! gap-2 dark:bg-slate-800 rounded-lg'>
                <span>Title</span>
                <InputBase value={formData.title} onChange={handleTitleChange} className='text-slate-950!  dark:bg-slate-700 border border-slate-500/25 dark:border-slate-600 lg:w-1/2 w-full p-1 dark:text-slate-200! rounded-lg' />
            </FormControl>
            <FormControl sx={{ m: 1 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                <span className="min-w-28">Bedrooms:</span>
                <ToggleButtonGroup
                    exclusive
                    value={formData.bedrooms}
                    onChange={handleBedrooms}
                    className="
                    flex! flex-wrap gap-3 items-center
                    [&_.MuiToggleButton-root]:border-0!
                    [&_.MuiToggleButton-root]:px-4
                    [&_.MuiToggleButton-root]:py-2
                    [&_.MuiToggleButton-root]:text-slate-500
                    dark:[&_.MuiToggleButton-root]:text-slate-300
                    [&_.MuiToggleButton-root.Mui-selected]:bg-blue-500!
                    [&_.MuiToggleButton-root.Mui-selected]:text-white!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:bg-blue-400!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:text-slate-950!
                    "
                >
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={0}>none</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={1}>1</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={2}>2</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={3}>3</ToggleButton>
                    <ToggleButton selected={formData.isCustomBedroom} className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value="custom">Custom</ToggleButton>
                    {
                        formData.isCustomBedroom &&
                        <NumberField
                            onValueChange={(value) =>
                                setFormData(prev => ({
                                    ...prev,
                                    bedrooms: typeof value === "number" ? value : null
                                }))
                            }
                            min={4}
                            size="small"
                            value={formData.bedrooms}
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
                    }
                </ToggleButtonGroup>
            </FormControl>
            <FormControl sx={{ m: 1 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                <span className="min-w-28">Bathrooms:</span>
                <ToggleButtonGroup
                    exclusive
                    value={formData.bathrooms}
                    onChange={handleBathrooms}
                    className="
                    flex! flex-wrap gap-3 items-center
                    [&_.MuiToggleButton-root]:border-0!
                    [&_.MuiToggleButton-root]:px-4
                    [&_.MuiToggleButton-root]:py-2
                    [&_.MuiToggleButton-root]:text-slate-500
                    dark:[&_.MuiToggleButton-root]:text-slate-300
                    [&_.MuiToggleButton-root.Mui-selected]:bg-blue-500!
                    [&_.MuiToggleButton-root.Mui-selected]:text-white!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:bg-blue-400!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:text-slate-950!
                    "
                >
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={0}>none</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={1}>1</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={1.5}>1.5</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={2}>2</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300!" value={2.5}>2.5</ToggleButton>
                    <ToggleButton selected={formData.isCustomBathroom} className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value="custom">Custom</ToggleButton>
                    {
                        formData.isCustomBathroom &&
                        <NumberField
                            onValueChange={(value) =>
                                setFormData(prev => ({
                                    ...prev,
                                    bathrooms: typeof value === "number" ? value : null
                                }))
                            }
                            min={3}
                            step={0.5}
                            size="small"
                            value={formData.bathrooms}
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
                    }
                </ToggleButtonGroup>
            </FormControl>
            <FormControl sx={{ m: 1 }} className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                <span className="min-w-28">Area:</span>
                <div className="flex gap-4">
                    <NumberField
                        size="small"
                        min={0}
                        value={formData.area}
                        onValueChange={(value) => handleArea(value)}
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
                    <Select size="small" value={formData.areaUnit} onChange={handleAreaUnit} className="dark:bg-slate-600 dark:text-slate-200! rounded-3xl!">
                        <MenuItem value="sqft">sqft (ft<sup>2</sup>)</MenuItem>
                        <MenuItem value="sqm">sqm (m<sup>2</sup>)</MenuItem>
                    </Select>
                </div>
            </FormControl>
            <FormControl sx={{ m: 1 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                <span className="min-w-28">Furnished?</span>
                <ToggleButtonGroup
                    exclusive
                    value={formData.isFurnished}
                    onChange={handleIsFurnished}
                    className="
                    flex! flex-wrap gap-3 items-center
                    [&_.MuiToggleButton-root]:border-0!
                    [&_.MuiToggleButton-root]:px-4
                    [&_.MuiToggleButton-root]:py-2
                    [&_.MuiToggleButton-root]:text-slate-500
                    dark:[&_.MuiToggleButton-root]:text-slate-300
                    [&_.MuiToggleButton-root.Mui-selected]:bg-blue-500!
                    [&_.MuiToggleButton-root.Mui-selected]:text-white!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:bg-blue-400!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:text-slate-950!
                    "
                >
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={true}>Yes</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={false}>No</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
            <FormControl sx={{ m: 1 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                <span className="min-w-28">Parking?</span>
                <ToggleButtonGroup
                    exclusive
                    value={formData.parking}
                    onChange={handleParking}
                    className="
                    flex! flex-wrap gap-3 items-center
                    [&_.MuiToggleButton-root]:border-0!
                    [&_.MuiToggleButton-root]:px-4
                    [&_.MuiToggleButton-root]:py-2
                    [&_.MuiToggleButton-root]:text-slate-500
                    dark:[&_.MuiToggleButton-root]:text-slate-300
                    [&_.MuiToggleButton-root.Mui-selected]:bg-blue-500!
                    [&_.MuiToggleButton-root.Mui-selected]:text-white!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:bg-blue-400!
                    dark:[&_.MuiToggleButton-root.Mui-selected]:text-slate-950!
                    "
                >
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={true}>Yes</ToggleButton>
                    <ToggleButton className="border! rounded-2xl! px-6! py-1! bg-slate-200/80! dark:bg-slate-600! dark:text-slate-300! capitalize!" value={false}>No</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
        </div>
    )
}