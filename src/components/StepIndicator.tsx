
const STEPS = [
    { id: 1, label: '上傳資料' },
    { id: 2, label: '上傳模板' },
    { id: 3, label: '設定規則' },
    { id: 4, label: '執行填入' },
];

interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="stepper-pro">
            {STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                
                return (
                    <div 
                        key={step.id} 
                        className={`step-item-pro ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                        <div className="step-circle-pro">
                            {isCompleted ? (
                                <i className="ri-check-line"></i>
                            ) : (
                                <span>{step.id}</span>
                            )}
                        </div>
                        <div className="text-[14px] font-medium text-[#888888] active:text-[#2D76FC] active:font-bold">
                            <span className={isActive ? 'text-[#2D76FC] font-bold' : ''}>
                                {step.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
