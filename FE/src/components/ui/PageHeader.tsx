import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    icon: ReactNode;
    description?: string;
}

const PageHeader = ({ title, icon, description }: PageHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader; 