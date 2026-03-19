import { Button, Drawer, IconButton, Step, StepLabel, Stepper, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { HomeDetailsStep } from "./stepperComponents/HomeDetailsStep";
import { LocationAndAvailabilityStep, type CountryOption, type UnitOptions } from "./stepperComponents/LocationAndAvailabilityStep";
import { PricePublishStep } from "./stepperComponents/PricePublishStep";
import type { PropsValue } from "react-select";

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
        durationUnit: null
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
            label: 'Location & Price',
            component: PricePublishStep
        }
    ]
    const ActiveStepComponent = steps[step].component

    const handleNextStepClick = () => {
        if (step === steps.length) return;
        setStep(prev => prev + 1)
    }

    const handleLastStepClick = () => {
        if (step === 0) return;
        setStep(prev => prev - 1)
    }
    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={closeDrawer}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: '70%', lg: '40%' },
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