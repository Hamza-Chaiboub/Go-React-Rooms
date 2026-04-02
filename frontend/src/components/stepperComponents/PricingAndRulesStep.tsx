import { Button, FormControl, styled, ToggleButton, ToggleButtonGroup } from "@mui/material"
import NumberField from "../NumberField"
import Select, { type PropsValue, } from "react-select"
import type { ListingFormData } from "../AddListingDrawer"
import type { Dispatch, SetStateAction } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type PricingAndRulesStepProps = {
    formData: ListingFormData,
    setFormData: Dispatch<SetStateAction<ListingFormData>>
}

export interface CurrencyOption {
    value: string;
    label: string;
}

export interface StatusOption extends CurrencyOption { }

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const PricingAndRulesStep = ({ formData, setFormData }: PricingAndRulesStepProps) => {
    const currencyOptions: CurrencyOption[] = [
        { value: "CAD", label: "Canadian Dollar" },
        { value: "USD", label: "American Dollar" }
    ]
    const statusOptions: StatusOption[] = [
        { value: "draft", label: "Draft" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
    ]

    const handlePriceChange = (price: number | null) => {
        setFormData(prev => ({
            ...prev,
            price: price
        }))
    }

    const handleCurrencyChange = (currency: PropsValue<CurrencyOption>) => {
        setFormData(prev => ({
            ...prev,
            currency: currency
        }))
    }
    const handlePetsAllowed = (_e: React.MouseEvent<HTMLElement>, data: boolean) => {
        setFormData(prev => ({
            ...prev,
            petsAllowed: data
        }))
    }
    const handleSmokingAllowed = (_e: React.MouseEvent<HTMLElement>, data: boolean) => {
        setFormData(prev => ({
            ...prev,
            smokingAllowed: data
        }))
    }
    const handleStatusChange = (status: PropsValue<StatusOption>) => {
        setFormData(prev => ({
            ...prev,
            status: status
        }))
    }
    const handleImageChange = (e: any) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }))
    }
    return (
        <div className="mb-4">
            <section className="flex gap-4 my-4">
                {/* price */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Price</span>
                    <NumberField
                        size="small"
                        min={0}
                        value={formData.price}
                        onValueChange={handlePriceChange}
                        outlineClassName="
                            w-full!
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
                </FormControl>
                {/* currency */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Currency</span>
                    <Select<CurrencyOption>
                        options={currencyOptions}
                        value={formData.currency}
                        onChange={handleCurrencyChange}
                        classNames={{
                            control: () => 'rounded-3xl!'
                        }}
                    />
                </FormControl>
            </section>
            <section className="flex gap-4 my-4">
                {/* pets */}
                <FormControl sx={{ m: 0 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                    <span className="min-w-28">Pets Allowed?</span>
                    <ToggleButtonGroup
                        exclusive
                        value={formData.petsAllowed}
                        onChange={handlePetsAllowed}
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
                {/* smoking */}
                <FormControl sx={{ m: 0 }} size="small" className='flex flex-1 flex-col! gap-2 items-start dark:bg-slate-800 rounded-lg'>
                    <span className="min-w-28">Smoking Allowed??</span>
                    <ToggleButtonGroup
                        exclusive
                        value={formData.smokingAllowed}
                        onChange={handleSmokingAllowed}
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
            </section>
            <section className="flex gap-4 my-4">
                {/* thumbnail */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Photo</span>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Photo
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleImageChange}
                            multiple
                        />
                    </Button>
                </FormControl>
                {/* status */}
                <FormControl className="w-1/2">
                    <span className="mb-2">Status</span>
                    <Select<StatusOption>
                        options={statusOptions}
                        value={formData.status}
                        onChange={handleStatusChange}
                        classNames={{
                            control: (state) => {
                                const selectedValue = (state.selectProps.value as StatusOption)?.value
                                // console.log("selected value: ", selectedValue)
                                // return ''
                                return `rounded-3xl! 
                                ${selectedValue === "active" ? "bg-green-400/20! text-green-400! inset-ring! inset-ring-green-500/20!" : (
                                        selectedValue === "inactive" ? "bg-gray-400/20! text-gray-400! inset-ring! inset-ring-gray-400/20!" : (
                                            selectedValue === "draft" ? "bg-yellow-400/20! text-yellow-500! inset-ring! inset-ring-yellow-400/20!" : ""
                                        )
                                    )}`
                            },
                            option: (state) => {
                                const selectedValue = state.data.value
                                // console.log("selected value: ", selectedValue)
                                // return ''
                                return `
                                ${selectedValue === "active" ? "bg-green-400/10! text-green-400! inset-ring! inset-ring-green-500/20!" : (
                                        selectedValue === "inactive" ? "bg-gray-400/10! text-gray-400! inset-ring! inset-ring-gray-400/20!" : (
                                            selectedValue === "draft" ? "bg-yellow-400/10! text-yellow-500! inset-ring! inset-ring-yellow-400/20!" : ""
                                        )
                                    )}`
                            }
                        }}
                    />
                </FormControl>
            </section>
        </div>
    )
}