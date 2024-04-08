import { type FC } from 'react'
import { StepImport } from './step-import/step-import'
import { StepCrop } from './step-crop/step-crop'
import {type ImageImportStep, useAppStateInContext } from '~/state/app.state'
import { StepRemoveBg } from './step-remove-bg/step-remove-bg'

// remove.bg api key ZuhzByJGtWeZsM2gAb4fTVsX
export const ImportImageDialog: FC = () => {
    const [open] = useAppStateInContext((state) => [
        state.dialogs.addImage,
    ])
    const step = useAppStateInContext((state) => state.importCurrentStep)
    const steps = ['import', 'crop', 'remove-bg'] as const
    const stepOrder = (step: ImageImportStep) => {
        return steps.indexOf(step)
    }

    const renderStep = (step: ImageImportStep) => {
        switch (step) {
            case 'import':
                return <StepImport />
            case 'crop':
                return <StepCrop />
            case 'remove-bg':
                return <StepRemoveBg />
        }
    }
    const stepLabel = {
            import: 'Import',
            crop: 'Crop',
            'remove-bg': 'Remove Background',
    } as const

    return (
        <dialog className={'modal items-start' + (open ? ' modal-open' : '')}>
            <div className="modal-box mt-12">
                <ul className="steps w-full">
                    {steps.map((stepName) => (
                        <li
                            className={`step ${
                                stepOrder(stepName) <= stepOrder(step)
                                    ? 'step-primary'
                                    : ''
                            }`}
                            key={stepName}
                        >
                            {stepLabel[stepName]}
                        </li>
                    ))}
                </ul>
                {renderStep(step)}
            </div>
        </dialog>
    )
}

export default ImportImageDialog
