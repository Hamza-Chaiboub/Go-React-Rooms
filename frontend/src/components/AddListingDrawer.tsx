import { Button, Drawer, IconButton, Step, StepLabel, Stepper, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { HomeDetailsStep } from "./stepperComponents/HomeDetailsStep";
import { LocationAndAvailabilityStep, type CountryOption, type UnitOptions } from "./stepperComponents/LocationAndAvailabilityStep";
import { PricingAndRulesStep, type CurrencyOption, type StatusOption } from "./stepperComponents/PricingAndRulesStep";
import type { PropsValue } from "react-select";
import { apiFetch } from "../api/api";

export type ListingFormData = {
    title: string;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    areaUnit: string;
    isFurnished: boolean | null;
    parking: boolean | null;
    isCustomBedroom: boolean;
    isCustomBathroom: boolean;
    preciseLocation: boolean;
    country: PropsValue<CountryOption> | null;
    postalCode: string;
    province: string;
    city: string;
    street: string;
    blockNumber: string;
    startDate: Date | null;
    endDate: Date | null;
    duration: number | null;
    durationUnit: PropsValue<UnitOptions>;
    price: number | null;
    currency: PropsValue<CurrencyOption> | null;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    status: PropsValue<StatusOption> | null;
}

export const AddListingDrawer = ({isOpen, closeDrawer}: {isOpen: boolean, closeDrawer: () => void}) => {
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState<ListingFormData>({
        title: "",
        bedrooms: null,
        bathrooms: null,
        area: null,
        areaUnit: "sqm",
        isFurnished: null,
        parking: null,
        isCustomBedroom: false,
        isCustomBathroom: false,
        preciseLocation: false,
        country: null,
        postalCode: "",
        province: "",
        city: "",
        street: "",
        blockNumber: "",
        startDate: null,
        endDate: null,
        duration: 0,
        durationUnit: null,
        price: 0,
        currency: null,
        petsAllowed: false,
        smokingAllowed: false,
        status: null
    })
    const steps = [
        {
            label: 'Home Details',
            component: HomeDetailsStep
        },
        {
            label: 'Location & Availability',
            component: LocationAndAvailabilityStep
        },
        {
            label: 'Pricing & Rules',
            component: PricingAndRulesStep
        }
    ]
    const ActiveStepComponent = steps[step].component

    const handleNextStepClick = () => {
        if (step === steps.length - 1) {
            submitListingForm()
            return
        };
        setStep(prev => prev + 1)
    }

    const handleLastStepClick = () => {
        if (step === 0) return;
        setStep(prev => prev - 1)
    }

    const submitListingForm = async () => {
        const apiUrl = import.meta.env.VITE_API_URL as string
        try {
            var startDateRaw = new Date(formData.startDate as Date)
            var endDateRaw = new Date(formData.endDate as Date)
            var convertedMinLeaseDays
            if (formData.duration) {
                switch ((formData.durationUnit as UnitOptions)?.value) {
                    case "day":
                        convertedMinLeaseDays = formData.duration;
                        break;
                    case "week":
                        convertedMinLeaseDays = formData.duration * 7;
                        break;
                    case "month":
                        convertedMinLeaseDays = formData.duration * 30;
                        break;
                    case "year":
                        convertedMinLeaseDays = formData.duration * 365;
                        break;
                    default:
                        convertedMinLeaseDays = formData.duration
                }
            }
            const dataToSubmit = {
                title: formData.title,
                description: "test desc",
                addressLine1: formData.blockNumber + " " + formData.street,
                city: formData.city,
                province: formData.province,
                country: (formData.country as CountryOption)?.value,
                postalCode: formData.postalCode,
                latitude: 0,
                longitude: 0,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                area: formData.area,
                areaUnit: formData.areaUnit,
                price: formData.price,
                currency: (formData.currency as CurrencyOption)?.value,
                availableFrom: startDateRaw.toISOString().replace('Z', '-05:00'), // I'll sort out the timezone later, get TZ offset from client
                AvailableUntil: endDateRaw.toISOString().replace('Z', '-05:00'),
                minLeaseDays: convertedMinLeaseDays,
                isFurnished: formData.isFurnished,
                petsAllowed: formData.petsAllowed,
                smokingAllowed: formData.smokingAllowed,
                parkingAvailable: formData.parking,
                status: (formData.status as StatusOption)?.value
            }
            const res = await apiFetch(`${apiUrl}`, "/listings/create", {
                method: "POST",
                body: JSON.stringify(dataToSubmit)
            })

            if (!res.ok) {
                let errorText = `Request failed with status ${res.status}`
                try {
                    const errorData =await res.json()
                    errorText = errorData.error || errorData 
                } catch {
                    errorText = res.statusText || errorText
                }
                throw new Error(errorText)
            }

            const data = await res.json()
            console.log(data)
        } catch (error) {
            console.log('error creating listing', error)
        }
    }
    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={closeDrawer}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: '80%', lg: '40%' },
                    paddingX: 4,
                    paddingY: 2
                }
            }}
            slotProps={{
                paper: {
                    className: "dark:bg-slate-800! dark:text-slate-200!"
                }
            }}
        >
            <div className="flex justify-between">
                <Typography fontSize={18} fontWeight={700}>Add new listing</Typography>
                <IconButton onClick={closeDrawer} className="dark:text-slate-200!">
                    <CloseIcon/>
                </IconButton>
            </div>
            <div>
                {/* I'll put these here so I don't forget them. This put me throught hell LOL:
                - &_.MuiStepLabel-label -> styles the label text
                - &_.MuiStepLabel-label.Mui-active -> active label
                - &_.MuiStepLabel-label.Mui-completed -> completed label
                - &_.MuiStepIcon-root -> circle/icon color
                - &_.MuiStepIcon-root.Mui-active -> active icon
                - &_.MuiStepIcon-root.Mui-completed -> completed icon
                */}
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            className="
                                [&_.MuiStepLabel-label]:font-semibold!
                                dark:[&_.MuiStepLabel-label]:text-slate-200!
                                [&_.MuiStepLabel-label.Mui-active]:text-blue-500!
                                dark:[&_.MuiStepLabel-label.Mui-active]:text-blue-300!
                                [&_.MuiStepLabel-label.Mui-completed]:text-emerald-500!
                                [&_.MuiStepIcon-root]:text-slate-600!
                                [&_.MuiStepIcon-root.Mui-active]:text-blue-500!
                                [&_.MuiStepIcon-root.Mui-completed]:text-emerald-500!
                                [&_.MuiStepConnector-line]:border-slate-700!
                                [&_.MuiStepConnector-root.Mui-active_.MuiStepConnector-line]:border-blue-500!
                                [&_.MuiStepConnector-root.Mui-completed_.MuiStepConnector-line]:border-emerald-500!
                            "
                        >
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {
                    step === steps.length ? (
                        <div>All done</div>
                    ) : (
                        <ActiveStepComponent formData={formData} setFormData={setFormData} />
                    )
                }
                <div className="flex justify-between flex-row-reverse">
                    <Button className="bg-slate-800! disabled:bg-slate-300! text-white! dark:bg-slate-500! dark:text-slate-200! dark:disabled:bg-slate-700/50!" disabled={step === steps.length} onClick={handleNextStepClick}>{step >= 2 ? "Finish" : "Next"}</Button>
                    <Button className="bg-slate-800! disabled:bg-slate-300! text-white! dark:bg-slate-500! dark:text-slate-200! dark:disabled:bg-slate-700/50!" disabled={step === 0} onClick={handleLastStepClick}>Back</Button>
                </div>
            </div>
        </Drawer>
    )
}