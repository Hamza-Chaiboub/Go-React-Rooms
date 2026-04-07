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
    images: File[];
}

const initialFormData: ListingFormData = {
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
    status: null,
    images: []
}

export const AddListingDrawer = ({ isOpen, closeDrawer, onSuccess }: { isOpen: boolean, closeDrawer: () => void, onSuccess: () => void }) => {
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState<ListingFormData>(initialFormData)
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
            const startDateRaw = new Date(formData.startDate as Date)
            const endDateRaw = new Date(formData.endDate as Date)

            let convertedMinLeaseDays = 0
            if (formData.duration) {
                switch ((formData.durationUnit as UnitOptions)?.value) {
                    case "day":
                        convertedMinLeaseDays = formData.duration
                        break
                    case "week":
                        convertedMinLeaseDays = formData.duration * 7
                        break
                    case "month":
                        convertedMinLeaseDays = formData.duration * 30
                        break
                    case "year":
                        convertedMinLeaseDays = formData.duration * 365
                        break
                    default:
                        convertedMinLeaseDays = formData.duration
                }
            }

            const form = new FormData() 
            form.append("title", formData.title)
            form.append("description", "test desc",)
            form.append("addressLine1", `${formData.blockNumber} ${formData.street}`.trim())
            form.append("city", formData.city)
            form.append("province", formData.province)
            form.append("country", (formData.country as CountryOption)?.value || "")
            form.append("postalCode", formData.postalCode)
            form.append("latitude", "0")
            form.append("longitude", "0")
            form.append("bedrooms", String(formData.bedrooms ?? 0))
            form.append("bathrooms", String(formData.bathrooms ?? 0))
            form.append("area", String(formData.area ?? 0))
            form.append("areaUnit", formData.areaUnit)
            form.append("price", String(formData.price ?? 0))
            form.append("currency", (formData.currency as CurrencyOption)?.value || "")
            form.append("availableFrom", startDateRaw.toISOString().replace('Z', '-05:00')) // I'll sort out the timezone later, get TZ offset from client
            form.append("AvailableUntil", endDateRaw.toISOString().replace('Z', '-05:00'))
            form.append("minLeaseDays", String(convertedMinLeaseDays))
            form.append("isFurnished", String(Boolean(formData.isFurnished)))
            form.append("petsAllowed", String(Boolean(formData.petsAllowed)))
            form.append("smokingAllowed", String(Boolean(formData.smokingAllowed)))
            form.append("parkingAvailable", String(Boolean(formData.parking)))
            form.append("status", (formData.status as StatusOption)?.value || "")
            form.append("altText", formData.title)
            form.append("thumbnailIndex", "0")

            formData.images.forEach((file) => {
                form.append("files", file)
            })

            const res = await apiFetch(apiUrl, "/listings/create", {
                method: "POST",
                body: form
            })

            if (!res.ok) {
                let errorText = `Request failed with status ${res.status}`
                try {
                    const errorData = await res.json()
                    errorText = errorData.error || errorData
                } catch {
                    errorText = res.statusText || errorText
                }
                throw new Error(errorText)
            }

            await res.json()

            setFormData(initialFormData)
            setStep(0)
            onSuccess?.()
            closeDrawer()
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